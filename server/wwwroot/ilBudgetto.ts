
import IsSupport from "./js/supported";

class Budgetto {
    private productVersion = "0.0.1";
    public support = new IsSupport();
    get vesrion() {
        return this.productVersion;
    }
}


let budgetto = new Budgetto();

window["budgetto"] = budgetto;

export default budgetto;