
const MainContainer = () => `<div id="mainPageId">
    <div class="date" id="mainDate">
        <span class="time" id="mainDateSpan"></span>
    </div>

    <div class="status" id="mainStatus">
        <div class="summary">Summary</div>
        <div class="currentState">
            <span id="mainCurrentText">Total: </span>
            <span id="mainCurrentValue">12542.2$</span>
        </div>
        <div class="existsToday">
            <span id="mainExistText">Exist today: </span>
            <span id="mainExistValue">12.42$</span>
        </div>

        <div class="chart" id="mainChart"></div>
    </div>

    <div class="buttons" id="mainButtons">
        <button class="actionButton" id="plusButton">
            <a class="buttonLink" href="#payment,event:plus,typeId:1">+</a>
        </button>
        <button class="actionButton" id="minusButton">
            <a class="buttonLink" href="#payment,event:minus,typeId:1">-</a>
        </button>
    </div>

</div>`


export default MainContainer;