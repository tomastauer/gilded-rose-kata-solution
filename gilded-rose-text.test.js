const _ = require('lodash');
const fs = require('fs');
const expect = require('expect');

const {Item, Shop} = require('./gilded-rose');



describe('text tests', () => {

    const items = [];
    items.push(new Item('+5 Dexterity Vest', 10, 20));
    items.push(new Item('Aged Brie', 2, 0));
    items.push(new Item('Elixir of the Mongoose', 5, 7));
    items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
    items.push(new Item('Sulfuras, Hand of Ragnaros', -1, 80));
    items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
    items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49));
    items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49));
    items.push(new Item('Conjured Mana Cake', 2, 6));
    items.push(new Item('Conjured Mana Cake', 3, 5));
    items.push(new Item('Conjured Mana Cake', 4, 25));
    const shop = new Shop(items);

    function getTable(day, items) {
        let result = `-------- day ${day} --------\r\n`;
        result += 'name, sellIn, quality\r\n';
        items.forEach(item => {
            result += _.values(item).join(', ') + '\r\n';
        });
        result += '\r\n';

        return result;
    }

    it('should show current state after two days', () => {
        let result = '';
        for(let i = 0; i<= 30; i++)
        {
            result += getTable(i, items);
            shop.updateQuality();
        }

        const expectedData = fs.readFileSync('textTests').toString();

        expect(result).toEqual(expectedData);
    });
});