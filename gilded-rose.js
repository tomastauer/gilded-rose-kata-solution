exports.Item = class {
    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
};

const BACKSTAGE = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const AGED_BRIE = 'Aged Brie';
const CONJURED = 'Conjured Mana Cake';

exports.Shop = class {
    constructor(items = []) {
        this.items = items;
    }

    increaseQuality(item, increment = 1) {
        item.quality = Math.min(50, item.quality + increment);
    }

    decreaseQuality(item, decrement = 1) {
        item.quality = Math.max(0, item.quality - decrement);
    }

    handleBackstage(item)
    {
        if(item.sellIn <= 0) {
            item.quality = 0;
            return;
        }

        let increment = 1;
        if(item.sellIn <= 5)  {
            increment = 3;
        }
        else if (item.sellIn <= 10) {
            increment = 2;
        }

        this.increaseQuality(item, increment);
    }

    handleAgedBrie(item) {
        let increment = 1;
        if(item.sellIn <= 0) {
            increment = 2;
        }

        this.increaseQuality(item, increment);
    }

    handleRegular(item) {
        let decrement = 1;
        if(item.sellIn <= 0) {
            decrement = 2;
        }

        this.decreaseQuality(item, decrement);
    }

    handleConjured(item) {
        this.handleRegular(item);
        this.handleRegular(item);
    }

    updateQuality() {
        this.items.forEach(item => {
            switch(item.name)
            {
                case SULFURAS:
                    return;
                case AGED_BRIE:
                    this.handleAgedBrie(item);
                    break;
                case BACKSTAGE:
                    this.handleBackstage(item);
                    break;
                case CONJURED:
                    this.handleConjured(item);
                    break;
                default:
                    this.handleRegular(item);
                    break;
            }

            item.sellIn--;
        });

        return this.items;
    }
};
