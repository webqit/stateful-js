
/**
 * @imports
 */
import _wrapped from '@web-native-js/commons/str/wrapped.js';
import _unwrap from '@web-native-js/commons/str/unwrap.js';
import AbstractionInterface from './AbstractionInterface.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Abstraction class
 * ---------------------------
 */				

const Abstraction = class extends AbstractionInterface {
	 
	/**
	 * @inheritdoc
	 */
	constructor(expr) {
		super();
		this.expr = expr;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, trap = {}) {
		return this.expr.eval(context, trap);
	}
	
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return '(' + this.expr.toString(context) + ')';
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Abstraction) {
		if (_wrapped(expr, '(', ')') && !Lexer.match(expr, [' ']).length) {
			return new Static(
				parseCallback(_unwrap(expr, '(', ')'))
			);
		}
	}
};

/**
 * @exports
 */
export default Abstraction;
