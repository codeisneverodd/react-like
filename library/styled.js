const styled = styleObj =>
  ` style="${Object.entries(styleObj)
    .map(([property, value]) => {
      if (property === '@mobile') {
        return `@mobile={${Object.entries(value)
          .map(([p, v]) => `${p}: ${v}`)
          .join(';')}}`;
      }

      if (property === '@desktop') {
        return `@desktop={${Object.entries(value)
          .map(([p, v]) => `${p}: ${v}`)
          .join(';')}}`;
      }

      if (property.startsWith(':')) {
        return `${property}={${Object.entries(value)
          .map(([p, v]) => `this.style['${p}']='${v}'`)
          .join(';')}}`;
      }
      return `${property}: ${value}`;
    })
    .join(';')}; "`;

export default styled;
