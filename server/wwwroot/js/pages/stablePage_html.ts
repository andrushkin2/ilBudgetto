import { IStableWaste } from "../../../server/apiInstances/stableWaste";
import { ICurrency } from "../../../server/apiInstances/currencyApi";
import { IStableIncome } from "../../../server/apiInstances/stableIncome";
import { plusIcon } from "../icons";

const StableContainer = () => `<div id="stablePageId">
    <button class="stableButton" id="stableIncome">
        <span>Stable income:</span>
        <span id="stableSeleryText"></span>
    </button>
    <button class="stableButton stableButtonWaste" id="stableWaste">
        <span>Stable waste:</span>
        <span id="stableWasteText"></span>
    </button>

    <div class="windowPopup" id="stableWastePopup" style="display:none">
        <div class="windowHeader">Stable waste</div>
        <div class="form" id="stableWastePopupForm">
            <div class="plusButton" id="stableWastePlusButtonNode">
                <button class="actionButton" id="stableWastePlusButton">${ plusIcon("white") }</button>
            </div>
            <div class="buttons">
                <button class="button cancel" id="stableWasteCancel">Cancel</button>
                <button class="button apply" id="stableWasteApply">Apply</button>
            </div>
        </div>
    </div>
</div>`;


const getWasteInput = (currency: ICurrency[], data?: IStableWaste | IStableIncome) => `<div class="formFeild" data-id="${data ? data.id : ""}">
        <div class="row">
            <input class="input stableWasteValue" value="${ data ? data.value : 0}" type="number" inputmode="numeric" min="0" pattern="[0-9]*" title="Non-negative integral number"/>
            <select class="select stableWasteCurrency" value="${ data ? data.currencyId : "1"}">
                ${ currency.reduce((res, curr) => res + `<option value="${curr.id}">${curr.name}</option>`, "") }
            </select>
        </div>
        <div class="row">
            <input class="input stableWasteName" value="${ data ? data.name : "" }" type="text" placeholder="Type a name here"/>
        </div>
    </div>`;

export { getWasteInput as GetWasteInput };

export default StableContainer;