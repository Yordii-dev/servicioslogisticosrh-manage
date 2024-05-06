export const loaderPage = (loading, where, { backgroundColor } = {}) => {
  return loading.show({
    // Optional parameters
    backgroundColor,
    container: document.querySelector(where),
    canCancel: false,
    color: 'rgb(27, 209, 155)',
    height: '25',

    onCancel: false,
  })
}
