var UserSchema = new mongoose.Schema({
    userid     : Number,
	username   : String,
    nickname   : String,
    headerUrl  : String,
    sex        : Number,
	location   : {
        type  : [Number],
        index : '2d'
    },
    age        : Number,
    sign       : String,
    disance    : Number,
    userGoodInstrument : String,
});
mongoose.model("UserLocation",UserSchema);