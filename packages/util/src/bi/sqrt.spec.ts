// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from '../bn';
import { nSqrt } from '.';

const TESTS: [string | number | BN | bigint, string | number][] = [
  [0, 0],
  [1, 1],
  [4, 2],
  [256 * 256, 256],
  [Number.MAX_SAFE_INTEGER, 94906265],
  [new BN(Number.MAX_SAFE_INTEGER).iaddn(256), 94906265],
  [12345678n * 12345679n, 12345678],
  // test cases below from https://github.com/Aisse-258/bigint-isqrt/blob/f5254b9750841959022461c1353437a07a08f501/test/sqrt-test.js
  [
    '54866395443885995655625',
    '234235768925'
  ],
  [
    '82120471531550314555681345949499512621827274120673745141541602816614526075010755373654280259022317599142038423759320355177481886719814621305828811322920076213800348341464996337890625',
    '9062034624274524065844376014975805577107171799890766992670739972241112960081909332275390625'
  ],
  [
    '2068290204957779940494571454815902632050207752627007664813877111611972735314294907791993008455381265730624848057015476004143868408297250386512042711005577373327434315310235583583151773358353534031397385969275475421659036494173765903706963544628565027679444680637920371210258368358706248446698622704138943704561842220533563976838506992543814273403403362954987589637283890281226038798503294069403370486523697009383229578343444337394508531937972775639593763364402389410142290440075517598007930025487176173228232153685095699851764630884360483051570513804913157899314303269924424908606245851172031453725690942288677622973423417902662711606364188470325930406288190754356367655606430407552275285889968860367977288564364154999338284288438279464648663835830140826171534470717958048887869721791862539529444820484648908879364324577951008050851801647916673254009490596379549192296404841454780884358889449367135382779230574781333008561195244620152128505091883408484094800737142399855337799331037607433934520934135669364954550499058123797911762228642423567268540444910163468496805547450495819213412636594319148417857753712526066272727725420886898680432958409892237191284583904066400736417812258327303739879128916456683685232170600928808798462776174857486589598776587550843543720784829419478239563366491666155716208452087857080883906200829769222868347286071365156305396955420561718593130305703074908891135467193627721682044757187980688062367562451981939375400543212890625',
    '45478458691536369397924851088318871329614555665525810477032568598360481742967756704524034986984134271202405190906906195123751965012732122548540879928668891416468847696038707003466943811913626146981446753434347552196868717612248915137033581428310504778371173112125038060138252719589122657221314190626986951627417768579641354255445988772645883238873672997347648890137913979299598785628581961589739331483895853398160785485300758458294999124984266041998145956341386549681176624661615465976970855592467853824812945820721933491609237311130118125761849911376495970746282571994312288380577879004620824004760109618074670810797544446334767103935754106103208789391060008291027361311679876439695844637933763721093782805837690830230712890625'
  ]
];

describe('nSqrt', (): void => {
  it('fails on < 0 roots', (): void => {
    expect(
      () => nSqrt(-1n)
    ).toThrow(/negative numbers is not supported/);
  });

  TESTS.forEach(([value, expected], index): void => {
    it(`calcs for test #${index}`, (): void => {
      expect(nSqrt(value) === BigInt(expected)).toEqual(true);
    });
  });
});
