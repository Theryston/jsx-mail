type Variable = {
  id: string;
  [key: string]: any;
};

interface Global {
  __jsx_mail: {
    [key: string]: Variable[];
  };
}

declare const global: Global;

if (!global.__jsx_mail) {
  global.__jsx_mail = {};
}

export function insertGlobalVariableItem(name: string, value: Variable) {
  if (!global.__jsx_mail[name]) {
    global.__jsx_mail[name] = [value];
    return;
  }

  const sameVariable = (global.__jsx_mail[name] as any).find(
    (variable: Variable) => variable.id === value.id,
  );

  if (sameVariable) {
    return updateGlobalVariableItem(name, value.id, value);
  }

  (global.__jsx_mail[name] as any).push(value);
}

export function readGlobalVariable(name: string) {
  return global.__jsx_mail[name] || [];
}

export function cleanGlobalVariable(name: string) {
  delete global.__jsx_mail[name];
}

export function cleanAllGlobalVariables() {
  global.__jsx_mail = {};
}

export function updateGlobalVariableItem(
  name: string,
  id: string,
  value: Variable,
) {
  if (!global.__jsx_mail[name]) {
    return;
  }

  const variableIndex = (global.__jsx_mail[name] as any).findIndex(
    (variable: Variable) => variable.id === id,
  );

  if (variableIndex === -1) {
    return;
  }

  (global.__jsx_mail[name] as any)[variableIndex] = value;
}
