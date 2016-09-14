'use strict';

$(window).on('load', () => {
	let numbers = [], // Números a mostrar
			$rpta = $('#rpta'), // Respuesta a visualizar
			$ghost = $('#ghost'), // Texto que aparece en la parte superior
			CALCULATOR = {
				rpta: {
					lastTop: 0, // El último valor que se mostro como ghost
					lastValue: 0, // último valor dado para la operación continua
					lastResult: 0 // Última respuesta
				},
				equal: false, // ¿Se presiono igual?
				canDelete: false, // Puede borrar digitos o no
				operator: false, // ¿Se pulso algún operador?
				lastOperator: null // último operador pulsado para la operación continua
			};

	// http://www.asquare.net/javascript/tests/KeyCode.html
	const TARGET_KEY = {
		Numbers: {
			key: [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],
			keyPress: [48,49,50,51,52,53,54,55,56,57]
		},
		Button: [
			'division',
			'multiplication',
			'addition',
			'susbtraction',
			'point',
			'delete',
			'clear-all',
			'clear-entry'
		],
		Key: [
			[47,111], // division
			[42,106], // multiplication
			[43,107,187], // addition
			[45,109,189], // susbtraction
			[110,190], // decimal point
			8, // delete
			27, // escape
			46, // suppress
			[47,111,42,106,43,107,187,45,109,189,110,190,8,27,46] // arithmetic
		],
		Value: ['/', 'x', '+', '-', '*', '÷']
	};

	let onCalculate = (base) => {
		let result = 0;

		switch (base.char) {
			case '/':
			case '÷':
				result =
						isFinite(Decimal(base.result).div(base.number).toNumber()) ?
						(Decimal(base.result).div(base.number).toNumber()) :
						'No se puede dividir entre cero';
				break;
			case '*':
			case 'x':
				result = Decimal(base.result).mul(base.number).toNumber();
				break;
			case '-':
				result = Decimal(base.result).sub(base.number).toNumber();
				break;
			case '+':
				result = Decimal(base.result).add(base.number).toNumber();
				break;
			default:
				result = CALCULATOR.rpta.lastResult;
				break;
		}

		if (isNaN(result)) {
			clearAll();
			return result;
		}

		CALCULATOR.rpta.lastResult = result;

		return CALCULATOR.rpta.lastResult;
	};

	let clearAll = () => {
		CALCULATOR.lastOperator = null;
		CALCULATOR.rpta.lastResult = 0;
		CALCULATOR.rpta.lastValue = 0;
		CALCULATOR.rpta.lastTop = 0;
		CALCULATOR.operator = false;
		CALCULATOR.canDelete = false;
		CALCULATOR.equal = false;

		$ghost.val('');
		numbers = [];
		$rpta.val(0);
	};

	$('body').on('keypress', (evt) => {
		let which = evt.which || evt.keyCode || 0;

		if (TARGET_KEY.Numbers.keyPress.includes(which)) { // solo números
			if ($('#rpta').val().length < 17) { // length windows calculator
				valueSetOrGetNumber(evt.key, 'n' + evt.key);
			}
		} else if (which === 42 || which === 43 || which === 45 || which === 47) {
			// 42 => [x]
			// 43 => [+]
			// 45 => [-]
			// 47 => [÷]
			setAndgetOperator(evt);
		} else if (which === 13) { // = [=]
			getResult(evt);
		}
	});

	$('body').on('keydown', (evt) => {
		let which = evt.which || evt.keyCode || 0,
				getID;

		if (TARGET_KEY.Key[8].includes(which)) {
			if (TARGET_KEY.Key[0].includes(which)) getID = TARGET_KEY.Button[0];
			if (TARGET_KEY.Key[1].includes(which)) getID = TARGET_KEY.Button[1];
			if (TARGET_KEY.Key[2].includes(which)) getID = TARGET_KEY.Button[2];
			if (TARGET_KEY.Key[3].includes(which)) getID = TARGET_KEY.Button[3];
			if (TARGET_KEY.Key[4].includes(which)) { // decimal point
				getID = TARGET_KEY.Button[4];
				decimalPoint(evt);
			}
			if (TARGET_KEY.Key[5] === which) { // clear all
				getID = TARGET_KEY.Button[5];
				if (!CALCULATOR.equal) deleteDigit(evt);
			}
			if (TARGET_KEY.Key[6] === which) { // clear entry
				getID = TARGET_KEY.Button[6];
				clearAll();
			}
			if (TARGET_KEY.Key[7] === which) { // suppress
				getID = TARGET_KEY.Button[7];
				$rpta.val(0);
				CALCULATOR.rpta.lastTop = 0;
			}
			$('#' + getID).css({'background-color': '#d0d0d0'})
		} else if (TARGET_KEY.Numbers.key.includes(which)) {
			$('#n' + ((evt.key) || evt.target.value)).css({'background-color': '#d0d0d0'});
		} else if (which === 13) { // equal
			$('#equal').css({'background-color': '#bbbbbb'});
		}
	});

	$('body').on('keyup', (evt) => {
		let which = evt.which || evt.keyCode || 0,
				getID;

		if (TARGET_KEY.Key[8].includes(which)) {
			if (TARGET_KEY.Key[0].includes(which)) getID = TARGET_KEY.Button[0];
			if (TARGET_KEY.Key[1].includes(which)) getID = TARGET_KEY.Button[1];
			if (TARGET_KEY.Key[2].includes(which)) getID = TARGET_KEY.Button[2];
			if (TARGET_KEY.Key[3].includes(which)) getID = TARGET_KEY.Button[3];
			if (TARGET_KEY.Key[4].includes(which)) { // decimal point
				getID = TARGET_KEY.Button[4];
				decimalPoint(evt);
			}
			if (TARGET_KEY.Key[5] === which) { // clear all
				getID = TARGET_KEY.Button[5];
				if (!CALCULATOR.equal) deleteDigit(evt);
			}
			if (TARGET_KEY.Key[6] === which) { // clear entry
				getID = TARGET_KEY.Button[6];
				clearAll();
			}
			if (TARGET_KEY.Key[7] === which) { // suppress
				getID = TARGET_KEY.Button[7];
				$rpta.val(0);
				CALCULATOR.rpta.lastTop = 0;
			}
			$('#' + getID).css(
				$('#' + getID).is(':hover') ? {'background-color': '#d0d0d0'} : {'background-color': '#ececec'}
			);
		} else if (TARGET_KEY.Numbers.key.includes(which)) { // numbers
			$('#n' + (evt.key || evt.target.value)).css(
				$('#n' + (evt.key || evt.target.value)).is(':hover') ? {'background-color': '#d0d0d0'} : {'background-color': '#ececec'}
			);
		} else if (which === 13) { // equal
			$('#equal').css(
				$('#equal').is(':hover') ? {'background-color': '#51595d', 'color': '#fff'} : {'background-color': '#ececec'}
			);
		}
	});

	$('#clear-all').on('click', (evt) => {
		clearAll();
	});

	$('#clear-entry').on('click', (evt) => {
		if (!numbers.length) {
			CALCULATOR.rpta.lastResult = 0;
		} else if (CALCULATOR.operator) {
			CALCULATOR.rpta.lastValue = 0;
		} else if (numbers.length) {
			CALCULATOR.rpta.lastValue = 0;
		} else {
			CALCULATOR.rpta.lastValue = $rpta.val();
		}

		CALCULATOR.rpta.lastTop = 0;
		$rpta.val(0);
	});

	$('#delete').on('click', (evt) => {
		deleteDigit(evt);
	});

	$('#point').on('click', (evt) => {
		decimalPoint(evt);
	});

	/* start: styles */
	// Todos los botones menos el boton #equal
	$('button:not(#equal)').on('mouseenter', (evt) => {
		let $element = $('#' + evt.target.id);
		$element.css({'background-color': '#d0d0d0'});
	});

	$('button:not(#equal)').on('mousedown keydown', (evt) => {
		let which = evt.which || evt.keyCode || 0;

		if (which === 32 || which === 1) {
			let $element = $('#' + evt.target.id);
			$element.css({ 'background-color': '#bbbbbb' });
		}
	});

	$('button:not(#equal)').on('mouseup', (evt) => {
		let which = evt.which || evt.keyCode || 0;
		
		if (which === 0 || which === 1 || which === 32) {
			let $element = $('#' + evt.target.id);
			$element.css({ 'background-color': '#d0d0d0' });
		}
	});

	$('button:not(#equal)').on('mouseleave keyup', (evt) => {
		let which = evt.which || evt.keyCode || 0;
		
		if (which === 0 || which === 1 || which === 32) {
			let $element = $('#' + evt.target.id);
			$element.css({ 'background-color': '#ececec' });
		}
	});

	$('button#equal').on('mouseenter', (evt) => {
		let which = evt.which || evt.keyCode || 0;
		
		if (which === 0 || which === 1 || which === 32) {
			let $element = $('#' + evt.target.id);
			$element.css({ 'background-color': '#51595d', 'color': '#fff' });
		}
	});

	$('button#equal').on('mouseleave keyup', (evt) => {
		let which = evt.which || evt.keyCode || 0;
		
		if (which === 0 || which === 1 || which === 32) {
			let $element = $('#' + evt.target.id);
			$element.css({ 'background-color': '#ececec', 'color': '#000' });
		}
	});

	$('button#equal').on('mousedown keydown', (evt) => {
		let which = evt.which || evt.keyCode || 0;

		if (which === 32 || which === 1) {
			let $element = $('#' + evt.target.id);
			$element.css({'background-color': '#7b8082', 'color': '#fff' });
		}
	});

	$('button#equal').on('mouseup', (evt) => {
		let which = evt.which || evt.keyCode || 0;

		if (which === 0 || which === 1 || which === 32) {
			let $element = $('#' + evt.target.id);
			$element.css({ 'background-color': '#51595d', 'color': '#fff' });
		}
	});
	/* end: styles */

	$('#equal').on('click', (evt) => {
		getResult(evt);
	});

	$('button.number, #more-or-less').on('click', (evt) => {
		if ($('#rpta').val().length < 17) { // length windows calculator
			valueSetOrGetNumber(evt.key, evt.target.id);
		}
	});

	$('button.arithmetic').on('click', (evt) => {
		setAndgetOperator(evt);
	});

	// set and get InputNumber
	function valueSetOrGetNumber(key, target_id) {
		let $element = !isNaN(key) ? key : $('#' + target_id).val(),
				value = $rpta.val() || '0';

		if (((isNaN(value) || value === '0') && value !== '0.') || CALCULATOR.operator) {
			$rpta.val('');
		}

		if (CALCULATOR.equal) {
			$rpta.val($element);
			CALCULATOR.rpta.lastResult = !numbers.length ? $element : 0;
		} else {
			if (CALCULATOR.operator) {
				$rpta.val('');
			}

			if ($('#' + target_id).text() === '±') {
				if (Decimal(value).isZero()) {
					$rpta.val(value);
				} else if (Decimal(value).isPositive() || Decimal(value).isNegative()) {
					$rpta.val(Decimal(value).neg().toNumber());
				}
			} else {
				$rpta.val($rpta.val() + $element);
			}

			CALCULATOR.rpta.lastResult = numbers.length === 2 ? numbers[0] : CALCULATOR.rpta.lastResult;
			CALCULATOR.lastOperator = numbers[numbers.length - 1];
		}

		CALCULATOR.equal = false;
		CALCULATOR.operator = false;
		CALCULATOR.canDelete = true;
		CALCULATOR.rpta.lastValue = numbers.length ? $rpta.val() : CALCULATOR.rpta.lastValue;
		CALCULATOR.rpta.lastTop = $rpta.val();
	}

	// set and get Arithmetic Operators
	function setAndgetOperator(evt) {
		// Operador pulsado
		let $character = TARGET_KEY.Value.includes(evt.key) ? evt.key : evt.target.value;

		if (isNaN($rpta.val())) return;

		// Agregar operador y valor si aún no existen
		if (!CALCULATOR.operator) {
			numbers.push(
										Decimal($rpta.val()).toNumber(),
										$character === '*' ? 'x' : ($character === '/' ? '÷' : $character)
									);
		}
		// Por si se cambia de operador
		let last = $ghost.val().trim().split(' ');
		// Si se cambió de caracter, este debe ser reemplazado
		if (isNaN(last[last.length-1]) && CALCULATOR.operator) {
			numbers.pop(); // Eliminar el último valor [caracter/operador]
			numbers.push($character === '*' ? 'x' : ($character === '/' ? '÷' : $character)); // Agregar el nuevo operador
		} else {
			if (numbers.length === 2) { // Con 2 valores no se puede operar
				// resetear el último valor a cero
				CALCULATOR.rpta.lastValue = $rpta.val();
			} else {
				$rpta.val(onCalculate({
						char: numbers[numbers.length - 3],
						result: !CALCULATOR.rpta.lastResult ? numbers[numbers.length - 4] : CALCULATOR.rpta.lastResult,
						number: $rpta.val(),
					}));

				CALCULATOR.rpta.lastResult = $rpta.val();
				CALCULATOR.rpta.lastValue = !CALCULATOR.equal ? $rpta.val() : numbers[numbers.length - 2];
			}
		}

		// Mostrar los caracteres seleccionados en el input-ghost
		if (!isNaN($rpta.val())) $ghost.val(numbers.join(' '));
		CALCULATOR.operator = true;
		CALCULATOR.canDelete = false;
		CALCULATOR.rpta.lastTop = $rpta.val();
		CALCULATOR.lastOperator = (numbers[numbers.length - 1]);
	}

	// Equal
	function getResult(evt) {
		if (!isNaN(Number($rpta.val()))) {
			if (!numbers.length && !CALCULATOR.rpta.lastValue && !CALCULATOR.rpta.lastResult) {
				$rpta.val(parseFloat($rpta.val()));
			} else {
				let values = {
					char: CALCULATOR.lastOperator,
					result: numbers.length === 2 ? numbers[0] : Number(CALCULATOR.rpta.lastResult),
					number: !($ghost.val().trim()) ? Number(CALCULATOR.rpta.lastValue) : Number(CALCULATOR.rpta.lastTop),
				};

				$rpta.val(onCalculate(values));
				CALCULATOR.operator = false;
				CALCULATOR.canDelete = false;
				$ghost.val('');
				numbers = [];
			}
			CALCULATOR.equal = true;
		}
	}

	// delete digit
	function deleteDigit(evt) {
		if (CALCULATOR.canDelete) {
			$rpta.val(
									$rpta.val().length !== 1 ?
									$rpta.val().substring(0, $rpta.val().length - 1) :
									0
							 )

			if (!Number($rpta.val())) {
				CALCULATOR.rpta.lastTop = 0;
				CALCULATOR.rpta.lastValue = 0;
			}
		}
	}

	// Only decimal point
	function decimalPoint(evt) {
		let $value = $('#rpta');
		CALCULATOR.canDelete = true;

		if (!CALCULATOR.operator) {
			$value.val($value.val() + ($value.val().indexOf('.') === -1 ? '.' : ''));
		} else {
			$rpta.val(0);
			$value.val($value.val() + ($value.val().indexOf('.') === -1 ? '.' : ''));
		}
	}
});