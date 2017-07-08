const expect = require('expect');
const _ = require('lodash');
const fs = require('fs');

const {Item, Shop} = require('./gilded-rose');

describe('gilded rose', () => {
    describe('regular item', () => {
        function getRegularItem(sellIn, quality) {
            return new Item('regular item', sellIn, quality);
        }

        describe('before expiration', () => {
            it('should decrease its quality by one', () => {
                const item = getRegularItem(1, 5);
                const shop = new Shop([item]);

                shop.updateQuality();
                expect(item.sellIn).toBe(0);
                expect(item.quality).toBe(4);
            });

            it('should never decrease its quality below zero', () => {
                const item = getRegularItem(5, 0);
                const shop = new Shop([item]);

                shop.updateQuality();
                expect(item.sellIn).toBe(4);
                expect(item.quality).toBe(0);
            });

            it('should decrease quality of multiple items', () => {
                const items = [getRegularItem(4, 3), getRegularItem(2, 4)];
                const shop = new Shop(items);

                shop.updateQuality();
                expect(items[0].sellIn).toBe(3);
                expect(items[0].quality).toBe(2);

                expect(items[1].sellIn).toBe(1);
                expect(items[1].quality).toBe(3);
            });
        });

        describe('after expiration', () => {
            it('should decrease its quality by two', () => {
                const item = getRegularItem(0, 5);
                const shop = new Shop([item]);

                shop.updateQuality();
                expect(item.sellIn).toBe(-1);
                expect(item.quality).toBe(3);
            });

            it('should never decrease its quality below zero', () => {
                const item = getRegularItem(-2, 1);
                const shop = new Shop([item]);

                shop.updateQuality();
                expect(item.sellIn).toBe(-3);
                expect(item.quality).toBe(0);
            });

            it('should decrease quality of multiple items', () => {
                const items = [getRegularItem(-1, 3), getRegularItem(-2, 1)];
                const shop = new Shop(items);

                shop.updateQuality();
                expect(items[0].sellIn).toBe(-2);
                expect(items[0].quality).toBe(1);

                expect(items[1].sellIn).toBe(-3);
                expect(items[1].quality).toBe(0);
            });
        });
    });

    describe('Sulfuras, Hand of Ragnaros', () => {
        function getItem(sellIn, quality) {
            return new Item('Sulfuras, Hand of Ragnaros', sellIn, quality);
        }

        it('should never decrease sellin or quality', () => {
            const items = [getItem(-1, 30), getItem(13, 1)];
            const shop = new Shop(items);

            shop.updateQuality();
            expect(items[0].sellIn).toBe(-1);
            expect(items[0].quality).toBe(30);

            expect(items[1].sellIn).toBe(13);
            expect(items[1].quality).toBe(1);
        });
    });

    describe('Aged Brie', () => {
        function getBrie(sellIn, quality) {
            return new Item('Aged Brie', sellIn, quality);
        }

        it('should increase its quality by one', () => {
            const item = getBrie(1, 5);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(0);
            expect(item.quality).toBe(6);
        });

        it('should increase its quality by two even after expiration', () => {
            const item = getBrie(-12, 5);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(-13);
            expect(item.quality).toBe(7);
        });

        it('should increase its quality to 50', () => {
            const item = getBrie(5, 50);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(4);
            expect(item.quality).toBe(50);
        });

        it('should increase its quality correctly on edges', () => {
            const items = [getBrie(1, 10), getBrie(0, 10)];
            const shop = new Shop(items);

            shop.updateQuality();
            expect(items[0].sellIn).toBe(0);
            expect(items[0].quality).toBe(11);

            expect(items[1].sellIn).toBe(-1);
            expect(items[1].quality).toBe(12);
        });
    });

    describe('Backstage passes to a TAFKAL80ETC concert', () => {
        function getPass(sellIn, quality) {
            return new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality);
        }

        it('should increase its quality by one long time before expiration', () => {
            const item = getPass(20, 10);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(19);
            expect(item.quality).toBe(11);
        });


        it('should increase its quality correctly on edges', () => {
            const items = [getPass(11, 10), getPass(6, 10), getPass(1, 10)];
            const shop = new Shop(items);

            shop.updateQuality();
            expect(items[0].sellIn).toBe(10);
            expect(items[0].quality).toBe(11);

            expect(items[1].sellIn).toBe(5);
            expect(items[1].quality).toBe(12);

            expect(items[2].sellIn).toBe(0);
            expect(items[2].quality).toBe(13);
        });


        it('should increase its quality by two ten days before expiration', () => {
            const item = getPass(10, 10);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(9);
            expect(item.quality).toBe(12);
        });

        it('should increase its quality by three five days before expiration', () => {
            const item = getPass(5, 10);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(4);
            expect(item.quality).toBe(13);
        });

        it('should drop its quality to zero after expiration', () => {
            const item = getPass(0, 10);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(-1);
            expect(item.quality).toBe(0);
        });

        it('should increase its quality to 50', () => {
            const items = [getPass(11, 50), getPass(6, 49), getPass(1, 48)];
            const shop = new Shop(items);

            shop.updateQuality();
            expect(items[0].sellIn).toBe(10);
            expect(items[0].quality).toBe(50);

            expect(items[1].sellIn).toBe(5);
            expect(items[1].quality).toBe(50);

            expect(items[2].sellIn).toBe(0);
            expect(items[2].quality).toBe(50);
        });
    });

    describe('conjured item', () => {
        function getConjuredItem(sellIn, quality) {
            return new Item('Conjured Mana Cake', sellIn, quality);
        }

        it('should drop its quality by two before expiration', () => {
            const item = getConjuredItem(5, 10);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(4);
            expect(item.quality).toBe(8)
        });

        it('should drop its quality by four before expiration', () => {
            const item = getConjuredItem(-1, 10);
            const shop = new Shop([item]);

            shop.updateQuality();
            expect(item.sellIn).toBe(-2);
            expect(item.quality).toBe(6)
        });
    });
});
