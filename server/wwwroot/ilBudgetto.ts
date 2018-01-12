

class Budgetto {
    private productVersion = "0.0.1";
    get vesrion() {
        return this.productVersion;
    }
}

let budgetto = new Budgetto();


window["budgetto"] = budgetto;

export default budgetto;