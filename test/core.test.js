import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  encodePath,
  encodeQuery,
  encodeFragment,
  encodeURIComponentCustom
} from '../src/core.js';

test('encodePath leaves unreserved and pchar characters alone', () => {
  assert.equal(encodePath('abcXYZ019-._~!$&\'()*+,;=:@'), 'abcXYZ019-._~!$&\'()*+,;=:@');
});

test('encodePath encodes slash and space', () => {
  assert.equal(encodePath('a/b c'), 'a%2Fb%20c');
});

test('encodePath encodes percent and non-ASCII UTF-8', () => {
  assert.equal(encodePath('100% café'), '100%25%20caf%C3%A9');
});

test('encodeQuery leaves pchar plus slash and question mark', () => {
  assert.equal(
    encodeQuery("a/b?c=d&e!$'()*+,;=:@-._~"),
    "a/b?c=d&e!$'()*+,;=:@-._~"
  );
});

test('encodeQuery encodes space and hash', () => {
  assert.equal(encodeQuery('q=hello world#top'), 'q=hello%20world%23top');
});

test('encodeQuery encodes non-ASCII characters', () => {
  assert.equal(encodeQuery('q=naïve'), 'q=na%C3%AFve');
});

test('encodeFragment leaves pchar plus slash and question mark', () => {
  assert.equal(encodeFragment("sec/1?line=2&x!$'()*+,;=:@-._~"), "sec/1?line=2&x!$'()*+,;=:@-._~");
});

test('encodeFragment encodes space and hash', () => {
  assert.equal(encodeFragment('chapter 1#start'), 'chapter%201%23start');
});

test('encodeFragment encodes non-ASCII characters', () => {
  assert.equal(encodeFragment('café au lait'), 'caf%C3%A9%20au%20lait');
});

test('custom encoder accepts extra safe characters', () => {
  assert.equal(encodeURIComponentCustom('a/b c', ['/']), 'a/b%20c');
});

test('custom encoder with empty extra set behaves like strict encoding', () => {
  assert.equal(encodeURIComponentCustom('a/b c', []), 'a%2Fb%20c');
});

test('encodePath handles empty string', () => {
  assert.equal(encodePath(''), '');
});

test('encodeQuery handles empty string', () => {
  assert.equal(encodeQuery(''), '');
});
