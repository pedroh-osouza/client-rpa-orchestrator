export default {
  menu(win, app) {
    return {
      label: "Fechar Orquestrador",
      click: function () {
        console.log('close', app)
        app.quit();
      },
    };
  },
};
