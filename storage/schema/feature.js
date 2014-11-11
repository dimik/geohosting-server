'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GeometrySchema = require('./feature-geometry');

module.exports = new Schema({
  id: { type: String, unique: true, sparse: true },
  type: { type: String, enum: ['Feature'], required: true },
  geometry: { type: GeometrySchema, required: true },
  properties: { type: Schema.Types.Mixed },
  _quadKey: { type: String },
  _lat: { type: Number },
  _lng: { type: Number }
}, { toObject: { getters: true }, toJSON: { getters: true, transform: function (doc, ret, options) {
  ret.id = ret.id || ret._id;

  delete ret._id;
  delete ret.__v;
  delete ret._lat; delete ret._lng;
  delete ret._quadKey;

  return ret;
} } });
