const PaymentContainer = () => `<div id="paymentPageId">
    <div class="windowPopup" id="stableWastePopup">
        <div class="form">
            <div class="formFeild">
                <div class="row label_row">
                    <label class="label">Value:</label>
                </div>
                <div class="row">
                    <input id="paymentValue" class="input" value="0" type="number"/>
                    <select id="paymentCurrency" class="select" value="$">
                        <option value="1">$</option>
                    </select>
                </div>
            </div>
            <div class="formFeild">
                <div class="row label_row">
                    <label class="label">Comment:</label>
                </div>
                <div class="row">
                    <input id="paymentComment" class="input" value="" type="text"/>
                </div>
            </div>
            <div class="formFeild">
                <div class="row label_row">
                    <label class="label">Tags:</label>
                </div>
                <div class="row">
                    <input id="paymentTag" class="input" value="" type="text"/>
                </div>
            </div>
            <div class="formFeild">
                <div class="row label_row">
                    <label class="label">Date:</label>
                </div>
                <div class="row">
                    <input id="paymentDate" class="input" value="" type="text"/>
                </div>
            </div>
            <div class="buttons">
                <button class="button cancel" id="paymentCancel">Cancel</button>
                <button class="button apply" id="paymentApply">Apply</button>
            </div>
        </div>
    </div>
</div>`;


export default PaymentContainer;