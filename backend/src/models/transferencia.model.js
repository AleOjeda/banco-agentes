import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { ESTADOS, ESTADOS_VALIDOS } from '../constants/estados.js';
import { MONEDAS_VALIDAS } from '../constants/monedas.js';

class Transferencia extends Model {}

Transferencia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    referencia: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    cuentaOrigen: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cuentaDestino: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    titularDestino: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    // DECIMAL, nunca FLOAT: evita errores de redondeo en montos monetarios.
    monto: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },
    moneda: {
      type: DataTypes.ENUM(...MONEDAS_VALIDAS),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS_VALIDOS),
      allowNull: false,
      defaultValue: ESTADOS.NUEVA
    },
    fechaAprobacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaPago: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Transferencia',
    tableName: 'transferencias',
    indexes: [
      { unique: true, fields: ['referencia'] },
      { fields: ['estado'] },
      { fields: ['moneda'] }
    ]
  }
);

export default Transferencia;
