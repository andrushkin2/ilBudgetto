import { IIncoming } from "../../../server/apiInstances/incomingApi";
import { ICurrencyObject } from "./list";
import { ICONS_TYPES } from "../icons";
import { months } from "../dateParser";

const ListContainer = () => `<div id="listPageId">
    <div class="date" id="listDate">
        <span class="time" id="mainDateSpan"></span>
    </div>

    <div class="list" id="listBlock"></div>

</div>`;


const getIncomingRow = (incoming: IIncoming, currency: ICurrencyObject) => `<a ${incoming.id ? `href="#payment,id:${incoming.id}"` : ""}><div class="listIncomingRow" data-id="${incoming.id}">
        <div class="icon"> ${ ICONS_TYPES[incoming.typeId] }</div>
        <div class="text">${ incoming.comment}</div>
        <div class="value">${ incoming.value} ${ currency[incoming.currencyId] }</div>
    </div></a>`;

const getDateRow = (dateString: string) => `<div class="listRowDate">${ dateString }</div>`;

const getIncomingListRow = (incoming: IIncoming[], date: Date, total: number, currency: ICurrencyObject) => `<div class="listRow">
        ${ getDateRow(`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`)}
        ${ incoming.reduce((prev, next) => prev + getIncomingRow(next, currency), "")}
        <div class="total ${total < 0 ? "negative" : ""}">${ total } ${currency[1]}</div>
    </div>`;

export { getIncomingListRow };

export default ListContainer;