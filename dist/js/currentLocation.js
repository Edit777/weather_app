export default class CurrentLocation {
  constructor() {
    this._name = "Current Location";
    this._latitude = null;
    this._longitude = null;
    this._unit = "imperial";
  }

  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }

  get latitude() {
    return this._latitude;
  }
  set latitude(latitude) {
    this._latitude = latitude;
  }

  get longitude() {
    return this._longitude;
  }
  set longitude(longitude) {
    this._longitude = longitude;
  }

  get unit() {
    return this._unit;
  }
  set unit(unit) {
    this._unit = unit;
  }
  toggleUnit() {
    this._unit = this._unit === "imperial" ? "metric" : "imperial";
  }
}
