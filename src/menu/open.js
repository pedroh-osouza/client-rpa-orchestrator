export default {
  menu(win, app) {
    return {
      label: "Abrir Painel",
      click: function () {
        if (!win.isVisible()) win.show();
      },
    };
  },
};
