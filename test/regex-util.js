var expect= require('chai').expect;
var rewire=require('rewire');
var regexUtil=require('../helpers/regex-util');
var regexUtilPrivate=rewire('../helpers/regex-util');

describe('Regex utility helper', () => {
    describe('isEmail', () => {
        it('returns true if valid email:PVT', () => {
            var isValid= regexUtilPrivate.__get__('isEmail("tyagi.amreesh@gmail.com")');
            expect(isValid).to.equal(true);
        });
    });

    describe('getTokenFromRequest', () => {
        it('returns true if valid email', () => {
            var email="tyagi.amreesh@gmail.com"
            var isValid= regexUtil.isEmail(email);
            expect(isValid).to.equal(true);
        });
    });
});
