const createActionSet = (action: string) => ({
  DEFAULT: `@@IZZI/${action}`,
  ERROR: `@@IZZI/${action}_ERROR`,
  PENDING: `@@IZZI/${action}_PENDING`,
  SUCCESS: `@@IZZI/${action}_SUCCESS`,
});

export default createActionSet;
