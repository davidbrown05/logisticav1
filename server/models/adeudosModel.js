const mongoose = require("mongoose");

const AdeudosSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },

    adeudoLista: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Adeudos = mongoose.model("Adeudos", AdeudosSchema);
module.exports = Adeudos;
