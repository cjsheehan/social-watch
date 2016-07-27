import { chai } from 'meteor/practicalmeteor:chai';
import { centerOf } from './tweet.js';
import { avg } from './tweet.js';

describe('tweet', function () {
  it('calculate center point of bbox', function () {
    let bboxJson = Assets.getText('bbox.json');
    let bbox = JSON.parse(bboxJson);

    let expected = [(0).toFixed(6), (0).toFixed(6)];
    let actual = centerOf(bbox["bounding_box_a"]);
    chai.assert.deepEqual(actual, expected);

    expected = [(-3.5).toFixed(6), (0.5).toFixed(6)];
    actual = centerOf(bbox["bounding_box_b"]);
    chai.assert.deepEqual(actual, expected);
  })

  it('calculate avg of 2 numbers', function () {
    let a = -7;
    let b = 4;
    let expected = -1.5;
    chai.assert.equal(avg(a, b), expected);
  })
})