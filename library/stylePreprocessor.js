const regExps = {
  styles: /style="([^"])*"/g,
  firstTag: /<[^>]*>/,
  lastTag: /<\/[^\/]*>\s*$/,
  tags: /<[^>]*>/g,
  pseudos: /:on([^{])*={([^}])*}/g,
  mobiles: /@mobile={([^\}])*}/g,
  desktops: /@desktop={([^\}])*}/g,
};

const getStyleContent = tag => [...tag.match(regExps.styles)].map(style => style.split('"')[1]).join('');

const getTagContent = tag => tag.split('<')[1].split('>')[0];

const attributeAdder = (tag, property, value) => `<${getTagContent(tag)} ${property}="${value}">`;

const uuidAdder = (domStr, uuid) => domStr.replace(regExps.firstTag, tag => attributeAdder(tag, 'data-uuid', uuid));

const styleCombinator = domStr =>
  domStr.replaceAll(regExps.tags, tag => {
    const styles = tag.match(regExps.styles);
    if (!styles) return tag;

    return attributeAdder(tag.replaceAll(regExps.styles, ''), 'style', getStyleContent(tag));
  });

const pseudoClassProcessor = domStr => {
  const converter = pseudos => [...pseudos].map(p => p.replace('{', '"').replace('}', '"').replace(':', '')).join('');

  return domStr.replaceAll(regExps.tags, tag => {
    const pseudos = tag.match(regExps.pseudos);
    if (!pseudos) return tag;

    return `<${getTagContent(tag.replace(regExps.pseudos, ''))} ${converter(pseudos)}>`;
  });
};

const mediaQueryProcessor = domStr => {
  const breakpoint = 900;

  let _mobiles = [];
  let _desktops = [];

  const originalDomStr = domStr.replaceAll(regExps.tags, tag => {
    const styles = tag.match(regExps.styles);
    const mobiles = tag.match(regExps.mobiles);
    const desktops = tag.match(regExps.desktops);
    if (!styles || (!mobiles && !desktops)) return tag;

    const mediaQueryUUID = self.crypto.randomUUID().slice(0, 8);
    _mobiles = mobiles ? [..._mobiles, { mediaQueryUUID, devices: mobiles }] : _mobiles;
    _desktops = desktops ? [..._desktops, { mediaQueryUUID, devices: desktops }] : _desktops;

    return attributeAdder(
      tag.replace(regExps.mobiles, '').replace(regExps.desktops, ''),
      'data-media-query',
      mediaQueryUUID
    );
  });
  // console.log(_mobiles);
  // if ([..._mobiles, ..._desktops].length === 0) return originalDomStr;

  const converter = devices =>
    devices
      .map(device => device.split('{')[1].replace('}', ';'))
      .join('')
      .replaceAll(';', ' !important;');

  const createMediaQuery = ({ mediaQueryUUID, devices }) =>
    `[data-media-query="${mediaQueryUUID}"]{${converter(devices)}}`;

  const styleDomStr = `
    <style>
      @media screen and (max-width: ${breakpoint}px){
        ${_mobiles.length > 0 ? _mobiles.map(createMediaQuery).join('') : ''} 
      } 
      @media screen and (min-width: ${breakpoint}px){
        ${_desktops.length > 0 ? _desktops.map(createMediaQuery).join('') : ''}
      }
    </style>
    `;
  return originalDomStr.replace(regExps.lastTag, tag => styleDomStr + tag);
};

export {
  getStyleContent,
  getTagContent,
  uuidAdder,
  attributeAdder,
  styleCombinator,
  pseudoClassProcessor,
  mediaQueryProcessor,
};
