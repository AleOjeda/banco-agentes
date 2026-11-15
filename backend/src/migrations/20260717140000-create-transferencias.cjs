'use strict';

// Migración en CommonJS (.cjs): sequelize-cli/umzug cargan las migraciones
// con require(), incompatible con los módulos ES ("type": "module" del proyecto).
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transferencias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      referencia: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      cuentaOrigen: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cuentaDestino: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      titularDestino: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      monto: {
        type: Sequelize.DECIMAL(14, 2),
        allowNull: false
      },
      moneda: {
        type: Sequelize.ENUM('CLP', 'ARS', 'USD'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('NUEVA', 'APROBADA', 'PAGADA'),
        allowNull: false,
        defaultValue: 'NUEVA'
      },
      fechaAprobacion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaPago: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('transferencias', ['estado']);
    await queryInterface.addIndex('transferencias', ['moneda']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('transferencias');
  }
};
