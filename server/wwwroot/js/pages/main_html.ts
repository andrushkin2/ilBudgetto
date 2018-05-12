import { plusIcon, minusIcon, moneyBagColorfulIcon, coinsIcon } from "../icons";

const MainContainer = () => `<div id="mainPageId">
    <div class="date" id="mainDate">
        <span class="time" id="mainDateSpan"></span>
    </div>

    <div class="status" id="mainStatus">
        <div class="summary">Total</div>
        <div class="currentState">
            <span class="icon">${coinsIcon()}</span>
            <span id="mainCurrentText"></span>
            <span id="mainCurrentValue">12542.2$</span>
        </div>
    </div>
    <div class="status">
        <div class="summary">Daily budget</div>
        <div class="existsToday">
            <span class="icon">${moneyBagColorfulIcon()}</span>
            <span id="mainExistText"></span>
            <span id="mainExistValue">12.42$</span>
        </div>
    </div>

    <div class="list">
        <button class="actionButton" id="mainListButton">
            <a class="buttonLink" href="#list">Monthly expenses</a>
        </button>
    </div>

    <div class="buttons" id="mainButtons">
        <button class="actionButton" id="plusButton">
            <a class="buttonLink" href="#payment,event:plus,typeId:1">${plusIcon("white")}</a>
        </button>
        <button class="actionButton" id="minusButton">
            <a class="buttonLink" href="#payment,event:minus,typeId:1">${ minusIcon("white") }</a>
        </button>
    </div>

</div>`;


export default MainContainer;