import{r as u,I as R,j as i}from"./index-BzU-TBPJ.js";import{S as I,a as U,b as S,E as m,T as f}from"./index-B8ejE0m9.js";import{I as L}from"./index-CKkYrncz.js";var D={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-260 72h96v209.9L621.5 312 572 347.4V136zm220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0022.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z"}}]},name:"book",theme:"outlined"};function _(){return _=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t])}return e},_.apply(this,arguments)}const F=(e,n)=>u.createElement(R,_({},e,{ref:n,icon:D})),E=u.forwardRef(F),A=`/**
 * Access Mode 字段构建器
 * 负责构建 codec 对象的 access_mode 字段
 *
 * 字段转换规则：
 *
 * access_mode 字段：
 * - 数据来源：物模型维护表-读写类型 (readWriteType)
 * - 转换规则：
 *   - 'r' 或 'R' → TslAccessMode.R (只读)
 *   - 'w' 或 'W' → TslAccessMode.W (只写)
 *   - 'rw' 或 'RW' → TslAccessMode.RW (读写)
 *   - 未指定或无效值 → TslAccessMode.R (默认只读)
 */

export enum TslAccessMode {
	R = 'R',
	W = 'W',
	RW = 'RW',
}

export class AccessModeBuilder {
	static buildAccessMode(readWriteType: string | undefined): TslAccessMode {
		if (!readWriteType) return TslAccessMode.R;

		const type = readWriteType.toLowerCase();
		switch (type) {
			case 'r':
				return TslAccessMode.R;
			case 'w':
				return TslAccessMode.W;
			case 'rw':
				return TslAccessMode.RW;
			default:
				return TslAccessMode.R;
		}
	}
}
`,C=`/**
 * Data Type 字段构建器
 * 负责构建 codec 对象的数据类型相关字段（data_type, value_type, bacnet_type）
 *
 * 字段转换规则：
 *
 * 1. data_type 字段（BACnet 数据类型）：
 *    - 数据来源：物模型维护表-物模型数据类型 (tslDataType)
 *    - 转换规则（两步转换）：
 *      第一步：物模型类型 → TSL 内部类型
 *        - int → INT
 *        - long → LONG
 *        - float → FLOAT
 *        - double → DOUBLE
 *        - date → LONG (时间戳用长整型表示)
 *        - string → STRING
 *        - bool → BOOL
 *        - enum → ENUM
 *        - struct → STRUCT
 *        - array → ARRAY
 *      第二步：TSL 内部类型 → BACnet 数据类型
 *        - INT/LONG/FLOAT/DOUBLE → NUMBER
 *        - STRING → TEXT
 *        - BOOL → BOOL
 *        - ENUM → ENUM
 *        - STRUCT → OBJECT
 *        - ARRAY → ARRAY
 *
 * 2. value_type 字段（BACnet 值类型）：
 *    - 数据来源：根据 data_type、min/max 范围、枚举值、系数推导
 *    - 转换规则：
 *      - STRUCT/ARRAY → STRUCT
 *      - STRING → STRING
 *      - 有系数(coefficient > 0) → FLOAT
 *      - BOOL → UINT8
 *      - ENUM → 根据枚举值范围推导 (UINT8/16/32/64 或 INT8/16/32/64)
 *      - NUMBER → 根据 min/max 范围推导 (UINT8/16/32/64 或 INT8/16/32/64)
 *
 * 3. bacnet_type 字段（BACnet 对象类型）：
 *    - 数据来源：根据 data_type 和 access_mode 推导
 *    - 转换规则：
 *      - STRING → character_string_value_object
 *      - ENUM + R → multistate_input_object
 *      - ENUM + W → multistate_output_object
 *      - ENUM + RW → multistate_value_object
 *      - NUMBER + R → analog_input_object
 *      - NUMBER + W → analog_output_object
 *      - NUMBER + RW → analog_value_object
 *      - BOOL + R → binary_input_object
 *      - BOOL + W → binary_output_object
 *      - BOOL + RW → binary_value_object
 *      - OBJECT/ARRAY → 不输出该字段
 */

import { TslAccessMode } from './access-mode-builder';

/**
 * TSL 数据类型枚举
 */
export enum TslDataType {
	INT = 'INT',
	LONG = 'LONG',
	FLOAT = 'FLOAT',
	DOUBLE = 'DOUBLE',
	BOOL = 'BOOL',
	ENUM = 'ENUM',
	STRING = 'STRING',
	STRUCT = 'STRUCT',
	ARRAY = 'ARRAY',
}

/**
 * BACnet 数据类型枚举
 */
export enum BacnetDataType {
	TEXT = 'TEXT',
	BOOL = 'BOOL',
	ENUM = 'ENUM',
	OBJECT = 'OBJECT',
	NUMBER = 'NUMBER',
	ARRAY = 'ARRAY',
}

/**
 * BACnet 值类型枚举
 */
export enum BacnetValueType {
	STRING = 'STRING',
	UINT8 = 'UINT8',
	UINT16 = 'UINT16',
	UINT24 = 'UINT24',
	UINT32 = 'UINT32',
	UINT64 = 'UINT64',
	FLOAT = 'FLOAT',
	STRUCT = 'STRUCT',
	INT8 = 'INT8',
	INT16 = 'INT16',
	INT24 = 'INT24',
	INT32 = 'INT32',
	INT64 = 'INT64',
}

/**
 * 数据类型信息接口
 */
interface DataTypeInfo {
	data_type: string;
	value_type: string;
	bacnet_type?: string;
}

/**
 * Data Type 字段构建器类
 */
export class DataTypeBuilder {
	/**
	 * 检查是否是数值类型
	 */
	static isNumber(dataType: string | undefined): boolean {
		if (!dataType) return false;
		return [TslDataType.INT, TslDataType.LONG, TslDataType.FLOAT, TslDataType.DOUBLE].includes(dataType as TslDataType);
	}

	/**
	 * 检查是否是容器类型
	 */
	static isContainer(dataType: string | undefined): boolean {
		if (!dataType) return false;
		return [TslDataType.STRUCT, TslDataType.ARRAY].includes(dataType as TslDataType);
	}

	/**
	 * 将物模型数据类型转换为 TSL 内部格式
	 * @param tslDataType 物模型数据类型 (int, long, float, double, date, local_time, string, bool, enum, struct, array)
	 * @returns TSL 内部格式 (INT, LONG, FLOAT, DOUBLE, STRING, BOOL, ENUM, STRUCT, ARRAY)
	 */
	static convertToTslFormat(tslDataType: string | undefined): TslDataType {
		if (!tslDataType || tslDataType === '-') return TslDataType.INT;

		const type = tslDataType.toLowerCase().trim();

		const typeMap: Record<string, TslDataType> = {
			int: TslDataType.INT,
			long: TslDataType.LONG,
			float: TslDataType.FLOAT,
			double: TslDataType.DOUBLE,
			bool: TslDataType.BOOL,
			boolean: TslDataType.BOOL,
			enum: TslDataType.ENUM,
			string: TslDataType.STRING,
			struct: TslDataType.STRUCT,
			array: TslDataType.ARRAY,
			date: TslDataType.LONG, // date 当作 LONG 处理（时间戳）
			local_time: TslDataType.INT, // local_time 当作 INT 处理
		};

		const result = typeMap[type];

		if (!result) {
			console.warn(\`⚠️  未知的数据类型: "\${tslDataType}"，将使用默认类型 INT\`);
			return TslDataType.INT;
		}

		return result;
	}

	/**
	 * 将 IPSO 数据类型转换为 TSL 格式
	 * @param ipsoDataType IPSO 数据类型
	 * @returns TSL 数据类型
	 */
	static convertFromIpsoFormat(ipsoDataType: string | undefined): TslDataType {
		if (!ipsoDataType) return TslDataType.INT;

		const type = ipsoDataType.toUpperCase();

		// 整数类型
		if (type.includes('UINT') || type.includes('INT')) {
			return TslDataType.INT;
		}

		// 浮点类型
		if (type.includes('FLOAT') || type.includes('DOUBLE')) {
			return TslDataType.FLOAT;
		}

		// 布尔类型
		if (type.includes('BOOL') || type === 'BOOLEAN') {
			return TslDataType.BOOL;
		}

		// 枚举类型
		if (type.includes('ENUM')) {
			return TslDataType.ENUM;
		}

		// 字符串类型
		if (type.includes('STRING') || type.includes('UTF8') || type.includes('ASCII')) {
			return TslDataType.STRING;
		}

		// 结构体类型
		if (type.includes('STRUCT') || type.includes('OBJECT')) {
			return TslDataType.STRUCT;
		}

		// 数组类型
		if (type.includes('ARRAY')) {
			return TslDataType.ARRAY;
		}

		return TslDataType.INT;
	}

	/**
	 * TSL → BACnet 数据类型转换
	 * @param tslDataType TSL 数据类型
	 * @returns BACnet 数据类型
	 */
	static convertToBacnetDataType(tslDataType: string | undefined): BacnetDataType | null {
		if (this.isNumber(tslDataType)) {
			return BacnetDataType.NUMBER;
		} else if (tslDataType === TslDataType.STRING) {
			return BacnetDataType.TEXT;
		} else if (tslDataType === TslDataType.STRUCT) {
			return BacnetDataType.OBJECT;
		} else if (tslDataType === TslDataType.BOOL) {
			return BacnetDataType.BOOL;
		} else if (tslDataType === TslDataType.ENUM) {
			return BacnetDataType.ENUM;
		} else if (tslDataType === TslDataType.ARRAY) {
			return BacnetDataType.ARRAY;
		}

		return null;
	}

	/**
	 * BACnet 对象类型推导
	 * @param accessMode 访问模式
	 * @param dataType 数据类型
	 * @returns BACnet 对象类型，容器类型返回 undefined（不输出该字段）
	 */
	private static getBacnetObjectType(accessMode: string, dataType: string | undefined): string | undefined {
		// 容器类型无 BACnet 对象类型
		if (this.isContainer(dataType)) {
			return undefined;
		}

		// 字符串类型
		if (dataType === TslDataType.STRING) {
			return 'character_string_value_object';
		}

		// 数值类型、布尔类型或枚举类型
		let prefix: string;
		if (this.isNumber(dataType)) {
			prefix = 'analog_';
		} else if (dataType === TslDataType.BOOL) {
			prefix = 'binary_';
		} else if (dataType === TslDataType.ENUM) {
			prefix = 'multistate_';
		} else {
			return undefined;
		}

		// 根据访问模式确定后缀
		let suffix: string;
		if (accessMode === TslAccessMode.R) {
			suffix = 'input';
		} else if (accessMode === TslAccessMode.W) {
			suffix = 'output';
		} else {
			suffix = 'value';
		}

		return \`\${prefix}\${suffix}_object\`;
	}

	/**
	 * 从物模型表构建数据类型信息
	 *
	 * @param tslDataType 物模型表中的数据类型
	 * @param accessMode 访问模式 (R/W/RW)
	 * @returns 数据类型信息对象
	 */
	static buildDataTypeInfo(tslDataType: string | undefined, accessMode: string): DataTypeInfo {
		// 转换为 TSL 格式
		const normalizedType = this.convertToTslFormat(tslDataType);

		// 转换为 BACnet 数据类型
		const bacnetDataType = this.convertToBacnetDataType(normalizedType);

		// 获取 BACnet 对象类型
		const bacnetType = this.getBacnetObjectType(accessMode, normalizedType);

		return {
			data_type: bacnetDataType || BacnetDataType.TEXT,
			value_type: normalizedType,
			bacnet_type: bacnetType,
		};
	}

	/**
	 * 值类型推断算法
	 *
	 * 数据来源：根据 data_type、min/max 范围、枚举值、系数等信息推导
	 * 转换规则：
	 * 1. 容器类型（STRUCT/ARRAY）→ STRUCT
	 * 2. 字符串类型（STRING）→ STRING
	 * 3. 有系数（coefficient > 0）→ FLOAT（浮点类型）
	 * 4. BOOL 类型 → UINT8
	 * 5. ENUM 类型 → 根据枚举值的范围推导：
	 *    - 遍历所有枚举值，找出最小值和最大值
	 *    - 根据范围选择合适的整数类型（UINT8/16/32/64 或 INT8/16/32/64）
	 * 6. NUMBER 类型 → 根据 min/max 范围推导：
	 *    - 如果 max 为空，默认返回 UINT8
	 *    - 如果 min < 0 或 min 为空，使用有符号类型（INT8/16/32/64）
	 *    - 否则使用无符号类型（UINT8/16/32/64）
	 *    - 根据 max 值的大小选择合适的位宽
	 *
	 * @param dataType 数据类型
	 * @param min 最小值
	 * @param max 最大值
	 * @param mappings 枚举映射
	 * @param coefficient 系数
	 * @returns BACnet 值类型
	 */
	static inferValueType(dataType: string | undefined, min: number | undefined, max: number | undefined, mappings: Array<{ key: string; value: string }> = [], coefficient: number | undefined): BacnetValueType {
		// 1. 容器类型 → STRUCT
		if (this.isContainer(dataType)) {
			return BacnetValueType.STRUCT;
		}

		// 2. 字符串类型 → STRING
		if (dataType === TslDataType.STRING) {
			return BacnetValueType.STRING;
		}

		// 3. 有系数 → FLOAT（浮点类型）
		if (coefficient != null && coefficient > 0) {
			return BacnetValueType.FLOAT;
		}

		// 4. BOOL 类型 → UINT8
		if (dataType === TslDataType.BOOL) {
			return BacnetValueType.UINT8;
		}

		// 5. ENUM 类型：根据枚举值范围推导
		if (dataType === TslDataType.ENUM) {
			const { min: enumMin, max: enumMax } = this.getEnumRange(mappings);
			return this.selectIntegerType(enumMin, enumMax);
		}

		// 6. NUMBER 类型：根据范围推导
		return this.selectIntegerType(min, max);
	}

	/**
	 * 获取枚举值的范围
	 * @param mappings 枚举映射
	 * @returns 最小值和最大值
	 */
	private static getEnumRange(mappings: Array<{ key: string; value: string }>): { min: number; max: number } {
		let min = 0;
		let max = 0;

		for (const mapping of mappings) {
			const key = parseInt(mapping.key);
			if (!isNaN(key)) {
				if (key < min) min = key;
				if (key > max) max = key;
			}
		}

		return { min, max };
	}

	/**
	 * 根据范围选择合适的整数类型
	 * @param min 最小值
	 * @param max 最大值
	 * @returns BACnet 值类型
	 */
	private static selectIntegerType(min: number | undefined, max: number | undefined): BacnetValueType {
		// 无范围信息 → UINT8（默认值）
		if (max == null) {
			return BacnetValueType.UINT8;
		}

		const num = Math.ceil(max);

		if (min == null || min < 0) {
			// 有符号类型（min < 0 或 min 为空）
			if (IntegerRangeUtil.isInt8(num)) return BacnetValueType.INT8;
			if (IntegerRangeUtil.isInt16(num)) return BacnetValueType.INT16;
			if (IntegerRangeUtil.isInt32(num)) return BacnetValueType.INT32;
			return BacnetValueType.INT64;
		} else {
			// 无符号类型（min >= 0）
			if (IntegerRangeUtil.isUInt8(num)) return BacnetValueType.UINT8;
			if (IntegerRangeUtil.isUInt16(num)) return BacnetValueType.UINT16;
			if (IntegerRangeUtil.isUInt32(num)) return BacnetValueType.UINT32;
			return BacnetValueType.UINT64;
		}
	}
}

/**
 * 整数范围判断工具
 */
export class IntegerRangeUtil {
	static isUInt8(num: number): boolean {
		return num >= 0 && num <= 0xff; // 255
	}

	static isUInt16(num: number): boolean {
		return num >= 0 && num <= 0xffff; // 65535
	}

	static isUInt32(num: number): boolean {
		return num >= 0 && num <= 0xffffffff; // 4294967295
	}

	static isInt8(num: number): boolean {
		return num >= -128 && num <= 127;
	}

	static isInt16(num: number): boolean {
		return num >= -32768 && num <= 32767;
	}

	static isInt32(num: number): boolean {
		return num >= -2147483648 && num <= 2147483647;
	}

	static isInt64(num: number): boolean {
		return num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER;
	}
}
`,M=`/**
 * Default Value 字段构建器
 * 负责构建 codec 对象的 value 字段（默认值）
 *
 * 字段转换规则：
 *
 * value 字段 (默认值)：
 * - 数据来源：物模型维护表-默认值 (defaultValue)
 * - 转换规则：
 *   1. 优先使用物模型维护表中指定的默认值：
 *      - BOOL 类型特殊处理：true/1 → "1", false/0 → "0"
 *      - 其他类型：转换为字符串
 *   2. 如果没有指定，则根据数据类型生成默认值：
 *      - TEXT/STRING → ''
 *      - BOOL → '0' (假)
 *      - NUMBER/INT/LONG/FLOAT/DOUBLE → '' 
 *      - ENUM → '' 
 *      - STRUCT/ARRAY → ''
 *      - 其他类型 → ''
 */

export class DefaultValueBuilder {
	/**
	 * 构建默认值
	 * @param defaultValue 原始默认值
	 * @param dataType 数据类型
	 * @returns 格式化后的默认值字符串
	 */
	static buildDefaultValue(defaultValue: string | undefined, dataType: string): string {
		// 优先使用指定的默认值
		if (defaultValue != null && defaultValue !== '') {
			// BOOL 类型特殊处理：支持 "true"/"false" 和 "1"/"0" 两种格式
			if (dataType === 'BOOL') {
				const normalized = String(defaultValue).toLowerCase().trim();
				if (normalized === 'true' || normalized === '1') {
					return '1';
				}
				if (normalized === 'false' || normalized === '0') {
					return '0';
				}
				// 无效的 BOOL 值，返回空字符串
				return '';
			}
			// 其他类型直接转为字符串
			return String(defaultValue);
		}

		// 根据数据类型返回合适的默认值
		return this.getDefaultValueByType(dataType);
	}

	/**
	 * 根据数据类型获取默认值
	 * @param dataType 数据类型
	 * @returns 默认值字符串
	 */
	private static getDefaultValueByType(dataType: string): string {
		switch (dataType) {
			case 'TEXT':
			case 'STRING':
				return '';
			case 'BOOL':
				return '0';
			case 'NUMBER':
			case 'INT':
			case 'LONG':
			case 'FLOAT':
			case 'DOUBLE':
				return '';
			case 'ENUM':
				return '';
			case 'STRUCT':
			case 'ARRAY':
				return '';
			default:
				return '';
		}
	}
}
`,w=`/**
 * MaxLength 字段构建器
 * 负责构建 codec 对象的 max_length 字段
 *
 * 字段转换规则：
 *
 * max_length 字段（仅用于 TEXT/STRING 类型）：
 * - 数据来源：物模型维护表-长度上限 (maxLengthLimit 或 inputLengthLimit)
 * - 转换规则：
 *   1. 如果 data_type 不是 TEXT，不输出此字段
 *   2. 优先使用 maxLengthLimit
 *   3. 如果没有，使用 inputLengthLimit
 *   4. 如果都没有，不输出此字段
 * - 输出类型：整数
 */

export class MaxLengthBuilder {
	/**
	 * 构建 max_length 字段
	 * @param tslInfo 物模型信息对象
	 * @param dataType 数据类型
	 * @returns max_length 值，如果不适用则返回 undefined
	 */
	static buildMaxLength(tslInfo: any, dataType: string): number | undefined {
		// 仅用于 TEXT/STRING 类型
		if (dataType !== 'TEXT' && dataType !== 'STRING') {
			return undefined;
		}

		// 优先使用 maxLengthLimit，其次使用 inputLengthLimit
		const maxSize = tslInfo.maxLengthLimit || tslInfo.inputLengthLimit;
		if (maxSize != null) {
			return maxSize;
		}

		return undefined;
	}
}
`,V=`/**
 * Property Basic 字段构建器
 * 负责构建 codec 对象的基础字段（id, name, description）
 *
 * 字段转换规则：
 *
 * 1. id 字段：
 *    - 数据来源：物模型维护表-物模型属性标识 (propertyId)
 *    - 转换规则：直接使用 propertyId，如果没有则使用 \`prop_\${ipsoChannel}\` 作为后备
 *
 * 2. name 字段：
 *    - 数据来源：物模型维护表-英文名称 (name)
 *    - 转换规则：直接使用 name（如果没有则使用 propertyId 作为后备），
 *      若存在父级属性，则追加父级英文名称，格式为 name(parentName)
 *
 * 3. description 字段：
 *    - 数据来源：物模型维护表-英文描述/备注/解释语 (description)
 *    - 转换规则：去除前后空格，如果为空则不设置该字段
 */

import { TSLInfoMap } from '../../parser';

interface PropertyBasicInfo {
	id: string;
	name: string;
	description?: string;
}

export class PropertyBasicBuilder {
	static buildBasicInfo(tslInfo: any, tslInfoMap: TSLInfoMap): PropertyBasicInfo {
		const baseName = tslInfo.name || tslInfo.propertyId;
		const parentName = this.getParentName(tslInfo.propertyId, tslInfoMap);
		return {
			id: tslInfo.propertyId || \`prop_\${tslInfo.ipsoChannel}\`,
			name: parentName ? \`\${baseName}(\${parentName})\` : baseName,
			description: tslInfo.description?.trim(),
		};
	}

	private static getParentName(propertyId: string, tslInfoMap?: TSLInfoMap): string | null {
		if (!propertyId?.includes('.') || !tslInfoMap) return null;

		const parentId = propertyId.split('.').slice(0, -1).join('.');
		for (const tslInfos of Object.values(tslInfoMap)) {
			for (const info of tslInfos) {
				if (info.propertyId === parentId) {
					return info.name || null;
				}
			}
		}
		return null;
	}
}
`,P=`/**
 * Range 字段构建器
 * 负责构建 codec 对象的 range 字段
 *
 * 字段转换规则：
 *
 * range 字段（仅用于数值类型）：
 * - 数据来源：物模型维护表-最小值/最大值 (minValue, maxValue)
 * - 转换规则：
 *   1. 如果 data_type 不是 NUMBER，不输出此字段
 *   2. 浮点类型（FLOAT/DOUBLE）：保留原值
 *   3. 整数类型（INT/LONG）：向下取整（Math.floor）
 *   4. 如果 min 或 max 缺失，不输出此字段
 * - 输出类型：[number, number] 数组
 */

export class RangeBuilder {
	/**
	 * 构建 range 字段
	 * @param tslInfo 物模型信息对象
	 * @param valueType 数据类型
	 * @returns range 值 [min, max]，如果不适用则返回 undefined
	 */
	static buildRange(tslInfo: any, valueType: string): [number, number] | undefined {
		// 仅用于 NUMBER 类型
		if (!this.isNumberType(valueType)) {
			return undefined;
		}

		const min = tslInfo.minValue;
		const max = tslInfo.maxValue;

		// min 和 max 必须都存在
		if (min == null || max == null) {
			return undefined;
		}

		// 对于浮点类型保留原值，对于整数类型向下取整
		if (valueType === 'FLOAT' || valueType === 'DOUBLE') {
			return [min, max];
		} else {
			return [Math.floor(min), Math.floor(max)];
		}
	}

	/**
	 * 判断是否是数值类型
	 */
	private static isNumberType(dataType: string): boolean {
		return ['INT', 'LONG', 'FLOAT', 'DOUBLE', 'NUMBER'].includes(dataType);
	}
}
`,W=`/**
 * Reference 构建器
 * 负责构建 codec 对象的 reference 字段
 *
 * 字段转换规则：
 *
 * reference 字段（引用关系数组）：
 * - 数据来源：根据物模型字段的层级关系和 type(one_of) 字段推导
 * - 转换规则：
 *   1. 顶层字段（层级 <= 1）：不输出 reference 字段（返回 undefined）
 *   2. 如果父级的子级存在 type(one_of) 字段：
 *      - type(one_of) 字段本身的 reference = 空数组 []
 *      - 其他子级字段的 reference = [type(one_of) 字段]
 *   3. 如果父级的子级存在 type 字段（但不是 type(one_of)）：
 *      - 该父级底下的子级的 reference = 自己的子级（不包含其他同级字段）
 *   4. 默认情况：
 *      - reference = 父级的其他子级（排除自己）
 *   5. 有父级但无引用的情况：返回空数组 []
 */

/**
 * 字段类型映射
 */
export interface FieldTypeMap {
	[fieldId: string]: string;
}

/**
 * Reference 构建器类
 */
export class ReferenceBuilder {
	/**
	 * 构建 reference
	 *
	 * @param tslIdList 所有 TSL ID 列表
	 * @param currentId 当前字段 ID
	 * @param fieldTypeMap 字段类型映射（ipsoAuxiliaryFieldType）
	 * @returns reference 数组（如果有引用则返回数组，有父级但无引用则返回空数组 []，顶层字段返回 undefined）
	 */
	static buildReference(tslIdList: string[], currentId: string, fieldTypeMap: FieldTypeMap = {}): string[] | undefined {
		const targetLevel = currentId.split('.').length;

		// 顶层字段：不应有 reference，返回 undefined（不输出该字段）
		if (targetLevel <= 1) {
			return undefined;
		}

		// 找到父级前缀
		const targetPrefix = currentId.substring(0, currentId.lastIndexOf('.') + 1);

		// 查找父级的所有子级
		const siblings: string[] = [];
		let typeOneOfField: string | null = null;
		let hasTypeField = false;

		// 首先检查 fieldTypeMap 中是否有 type 类型的字段（包括 hidden 的字段）
		// 因为 hidden 字段不在 tslIdList 中，但它们的 type 信息需要用于判断
		for (const [fieldId, fieldType] of Object.entries(fieldTypeMap)) {
			// 必须是同一父级且同一层级
			if (fieldId.startsWith(targetPrefix) && fieldId.split('.').length === targetLevel) {
				// 找到 type(one_of) 字段
				if (fieldType === 'type(one_of)') {
					// 只有在 tslIdList 中存在的字段才能作为 reference
					if (tslIdList.includes(fieldId)) {
						typeOneOfField = fieldId;
					}
				}

				// 检查是否是 type 类型（但不是 type(one_of)）
				if (fieldType === 'type' || (fieldType && fieldType.startsWith('type') && fieldType !== 'type(one_of)')) {
					hasTypeField = true;
				}
			}
		}

		// 然后从 tslIdList 中收集同级字段（用于默认情况的 reference）
		for (const tempId of tslIdList) {
			// 必须是同一父级且同一层级
			if (tempId.startsWith(targetPrefix) && tempId.split('.').length === targetLevel) {
				siblings.push(tempId);
			}
		}

		// 规则 2: 如果父级的子级存在 type(one_of)，reference 就是那个 type(one_of) 的字段
		// 但是 type(one_of) 字段本身的 reference 是空数组
		if (typeOneOfField) {
			if (currentId === typeOneOfField) {
				// type(one_of) 字段本身：reference 是空数组
				return [];
			} else {
				// 其他字段：reference 是 type(one_of) 字段
				return [typeOneOfField];
			}
		}

		// 规则 3: 如果父级的子级存在 type（但不是 type(one_of)），这个父级底下的子级的 reference 不包含其他同级字段，只包含自己的子级
		if (hasTypeField) {
			// 查找当前字段的子级
			const currentPrefix = currentId + '.';
			const children: string[] = [];
			for (const tempId of tslIdList) {
				if (tempId.startsWith(currentPrefix)) {
					children.push(tempId);
				}
			}
			// 有父级但无子级：返回空数组 []（应有 reference 但为空）
			return children.length > 0 ? children : [];
		}

		// 规则 1: 默认情况：reference 包含父级的所有其他子级（排除自己）
		const result = siblings.filter(sibling => sibling !== currentId);
		// 有父级但无其他同级字段：返回空数组 []（应有 reference 但为空）
		return result.length > 0 ? result : [];
	}

	/**
	 * 从物模型信息中提取字段类型映射
	 * @param properties 属性列表
	 * @returns 字段类型映射
	 */
	static extractFieldTypeMap(properties: any[]): FieldTypeMap {
		const fieldTypeMap: FieldTypeMap = {};

		for (const prop of properties) {
			if (prop.id && prop.assist?.ipsoAuxiliaryFieldType) {
				fieldTypeMap[prop.id] = prop.assist.ipsoAuxiliaryFieldType;
			}
		}

		return fieldTypeMap;
	}

	/**
	 * 提取 TSL ID 列表（包含所有层级的字段 ID）
	 * @param properties 属性列表
	 * @param events 事件列表
	 * @param services 服务列表
	 * @returns TSL ID 列表
	 */
	static extractTslIdList(properties: any[] = [], events: any[] = [], services: any[] = []): string[] {
		const idList: string[] = [];

		// 从属性中提取
		for (const prop of properties) {
			if (prop.id) {
				idList.push(prop.id);
			}
		}

		// 从事件中提取
		for (const event of events) {
			if (event.id) {
				idList.push(event.id);
			}
			if (event.outputs) {
				for (const output of event.outputs) {
					if (output.id) {
						idList.push(output.id);
					}
				}
			}
		}

		// 从服务中提取
		for (const service of services) {
			if (service.id) {
				idList.push(service.id);
			}
			if (service.inputs) {
				for (const input of service.inputs) {
					if (input.id) {
						idList.push(input.id);
					}
				}
			}
		}

		return idList;
	}
}
`,k=`/**
 * Unit 字段构建器
 * 负责构建 codec 对象的单位相关字段（unit, bacnet_unit_type_id, bacnet_unit_type）
 *
 * 字段转换规则：
 *
 * unit 字段（单位名称）：
 * - 数据来源：物模型维护表-单位名称 (unitName)
 * - 转换规则：保持原始单位名称，不进行标准化（标准化由 UnitFixer 负责）
 *
 * bacnet_unit_type_id 字段（BACnet 单位类型 ID）：
 * - 数据来源：根据 unit 查找 BACnet 标准单位映射表
 * - 转换规则：
 *   1. 如果 unit 为空，返回 95 (UNITS_NO_UNITS)
 *   2. 如果 unit 为 '%'，根据字段语义判断：
 *      - 功率因数字段 → 15 (UNITS_POWER_FACTOR)
 *      - 其他百分比字段 → 98 (UNITS_PERCENT)
 *   3. 如果 unit 在 BACnet 标准单位表中，返回对应 ID
 *   4. 否则返回 95 (UNITS_NO_UNITS)，由 UnitFixer 后续修复
 *
 * bacnet_unit_type 字段（BACnet 单位类型名称）：
 * - 数据来源：根据 bacnet_unit_type_id 查找对应的 BACnet 单位类型名称
 * - 转换规则：与 bacnet_unit_type_id 对应
 *
 * 特殊处理：
 * - 功率因数识别：通过 propertyId 或 propertyName 包含 power_factor/powerfactor/power-factor/功率因数/pf 关键字判断
 */

import { bacnet_units_def } from 'codec-validator-action';

/**
 * 单位信息接口
 */
interface UnitInfo {
	unit: string;
	bacnet_unit_type_id: number;
	bacnet_unit_type: string;
}

/**
 * 单位定义接口
 */
interface UnitDefinition {
	id: number;
	name: string;
	unit: string;
}

/**
 * Unit 字段构建器类
 */
export class UnitBuilder {
	// BACnet 单位映射表（只存储标准单位，不包含别名）
	private static readonly unitMap: Map<string, UnitDefinition> = (() => {
		const map = new Map<string, UnitDefinition>();

		for (const def of bacnet_units_def) {
			const unit = def.unit;
			if (!map.has(unit)) {
				map.set(unit, {
					id: def.unit_type_id,
					name: def.unit_type,
					unit: def.unit,
				});
			}
		}

		return map;
	})();

	/**
	 * 判断字段是否是电气功率因数
	 */
	private static isPowerFactor(propertyId?: string, propertyName?: string): boolean {
		if (!propertyId && !propertyName) return false;

		const id = (propertyId || '').toLowerCase();
		const name = (propertyName || '').toLowerCase();

		const powerFactorKeywords = ['power_factor', 'powerfactor', 'power-factor', '功率因数', 'pf'];

		return powerFactorKeywords.some(keyword => id.includes(keyword) || name.includes(keyword));
	}

	/**
	 * 构建单位信息
	 */
	static buildUnitInfo(unitName: string | undefined, propertyId?: string, propertyName?: string): UnitInfo {
		// 默认值：无单位
		const defaultUnit: UnitInfo = {
			unit: '',
			bacnet_unit_type_id: 95, // UNITS_NO_UNITS
			bacnet_unit_type: 'UNITS_NO_UNITS',
		};

		if (!unitName) {
			return defaultUnit;
		}

		// 特殊处理：百分比单位需要根据字段语义判断
		if (unitName === '%') {
			// 判断是否是电气功率因数（PF）
			if (this.isPowerFactor(propertyId, propertyName)) {
				return {
					unit: '%',
					bacnet_unit_type_id: 15, // UNITS_POWER_FACTOR
					bacnet_unit_type: 'UNITS_POWER_FACTOR',
				};
			}
			return {
				unit: '%',
				bacnet_unit_type_id: 98, // UNITS_PERCENT
				bacnet_unit_type: 'UNITS_PERCENT',
			};
		}

		// 查找 BACnet 标准单位（使用原始单位名称，不进行标准化）
		const unitDef = this.unitMap.get(unitName);

		if (unitDef) {
			return {
				unit: unitName, // 保持原始单位名称
				bacnet_unit_type_id: unitDef.id,
				bacnet_unit_type: unitDef.name,
			};
		}

		// 未找到匹配的单位，保持原始单位名称，返回默认的 bacnet_unit_type_id
		// 这样 fixer 可以在修复阶段进行标准化并正确匹配
		return {
			unit: unitName, // 保持原始单位名称，不返回空字符串
			bacnet_unit_type_id: 95, // UNITS_NO_UNITS（临时值，fixer 会修复）
			bacnet_unit_type: 'UNITS_NO_UNITS', // 临时值，fixer 会修复
		};
	}
}
`,G=`/**
 * Values 字段构建器
 * 负责构建 codec 对象的 values 字段（枚举值数组）
 *
 * 字段转换规则：
 *
 * values 字段（枚举值数组）：
 * - 数据来源：物模型维护表-英文枚举 (enumDesc)
 * - 转换规则：
 *   1. 当 data_type 为 ENUM 或 BOOL 时生成 values 数组
 *   2. 解析 enumDesc 字符串（格式：\\"0: Off, 1: On, 2: Auto\\"）
 *   3. 转换为数组格式：[{value: 0, name: "Off"}, {value: 1, name: "On"}, {value: 2, name: "Auto"}]
 *   4. value 字段：尝试解析为数字，失败则保持字符串
 *   5. name 字段：去除前后空格
 *
 * 特殊情况：
 * - 如果 enumDesc 为空但 data_type 为 ENUM，则从 impl 类型的兄弟字段构建枚举
 * - impl 字段的 ipsoMapping 提供枚举 key（支持十六进制如 0x01）
 * - impl 字段的 name 提供枚举 name
 */

import { TSLInfoMap } from '../../parser';

/**
 * 值项接口（values 数组中的每一项）
 */
interface ValueItem {
	value: number | string;
	name: string;
}

/**
 * 枚举映射接口（物模型表中的格式）
 */
interface EnumMapping {
	key: string;
	value: string;
}

/**
 * Values 字段构建器类
 */
export class ValuesBuilder {
	/**
	 * 解析枚举描述字符串
	 * 输入: "0: Off, 1: On, 2: Auto"
	 * 输出: [{key: "0", value: "Off"}, {key: "1", value: "On"}, {key: "2", value: "Auto"}]
	 */
	static parseEnumDesc(enumDesc: string | undefined): EnumMapping[] {
		if (!enumDesc) return [];

		const mappings: EnumMapping[] = [];

		// 分割逗号
		const pairs = enumDesc.split(',');

		for (const pair of pairs) {
			// 查找冒号分隔符 (支持中英文)
			const delimiter = pair.includes('：') ? '：' : ':';
			if (!pair.includes(delimiter)) continue;

			// 只按第一个冒号分割，保留后面的完整内容（如 "1:condition: x<A" 应该分割为 "1" 和 "condition: x<A"）
			const delimiterIndex = pair.indexOf(delimiter);
			const key = pair.substring(0, delimiterIndex).trim();
			const value = pair.substring(delimiterIndex + delimiter.length).trim();

			if (key && value) {
				mappings.push({ key, value });
			}
		}

		return mappings;
	}

	/**
	 * 从 impl 类型的兄弟字段构建枚举映射
	 */
	static buildEnumFromImplSiblings(tslInfo: any, tslInfoMap: TSLInfoMap): EnumMapping[] {
		const mappings: EnumMapping[] = [];

		// 如果当前字段没有 propertyId 或不包含 '.'，则无法确定父级，返回空数组
		if (!tslInfo.propertyId || !tslInfo.propertyId.includes('.')) {
			return mappings;
		}

        let mapKey = '';
        if (tslInfo.ipsoMapping &&
            typeof tslInfo.ipsoMapping === 'string') {
            mapKey = tslInfo.ipsoMapping;
        } else {
            return mappings;
        }

		// 获取父级 ID（例如：interface_settings.object -> interface_settings）
		const parts = tslInfo.propertyId.split('.');
		const parentId = parts.slice(0, -1).join('.');

		// 遍历所有 TSL 信息，查找同父级的 impl 类型字段
		for (const tslInfos of Object.values(tslInfoMap)) {
			for (const siblingInfo of tslInfos) {
				// 检查是否为兄弟字段：
				// 1. 有 propertyId
				// 2. propertyId 包含父级 ID 作为前缀
				// 3. ipsoAuxiliaryFieldType 为 'impl'
				// 4. 有 ipsoMapping
				if (
					siblingInfo.propertyId &&
					siblingInfo.propertyId.startsWith(parentId + '.') &&
					siblingInfo.propertyId !== tslInfo.propertyId &&
					siblingInfo.ipsoAuxiliaryFieldType === 'impl' &&
					siblingInfo.ipsoMapping
				) {
					// 解析 ipsoMapping，格式可能是：
					// - 字符串: "interface_config：0x01"
					// - 对象: { "interface_config": "0x01" }
					let mappingValue: string | undefined;

					if (typeof siblingInfo.ipsoMapping === 'string') {
						// 字符串格式：提取冒号后的值
						const delimiter = siblingInfo.ipsoMapping.includes('：') ? '：' : ':';
						const delimiterIndex = siblingInfo.ipsoMapping.indexOf(delimiter);
						if (delimiterIndex !== -1) {
							mappingValue = siblingInfo.ipsoMapping.substring(delimiterIndex + delimiter.length).trim();
						}
					} else if (typeof siblingInfo.ipsoMapping === 'object') {

                        const keys = Object.keys(siblingInfo.ipsoMapping);
                        if (!keys.includes(mapKey)) {
                            continue;
                        }


						// 对象格式：取第一个值
						const values = Object.values(siblingInfo.ipsoMapping);
						if (values.length > 0) {
							mappingValue = String(values[0]);
						}
					}

					// 如果成功提取到映射值，则添加到枚举映射中
					if (mappingValue) {
						// 将十六进制值转换为十进制数字（例如：0x01 -> 1）
						let enumKey: string;
						if (mappingValue.startsWith('0x') || mappingValue.startsWith('0X')) {
							const hexValue = parseInt(mappingValue, 16);
							enumKey = String(hexValue);
						} else {
							enumKey = mappingValue;
						}

						// 使用兄弟字段的英文名称作为枚举项的名称
						const enumName = siblingInfo.name || siblingInfo.propertyId;

						mappings.push({
							key: enumKey,
							value: enumName,
						});
					}
				}
			}
		}

		return mappings;
	}

	/**
	 * 从枚举映射构建 codec 的 values 数组
	 */
	static buildValues(mappings: EnumMapping[]): ValueItem[] {
		const result: ValueItem[] = [];

		for (const mapping of mappings) {
			const parsedKey = parseInt(mapping.key);
			const value = !isNaN(parsedKey) ? parsedKey : mapping.key;

			result.push({
				value,
				name: mapping.value.trim(),
			});
		}

		return result;
	}
}
`,J=`/**
 * Fixer 基类
 * 所有 fixer 都继承自此类
 */

import { BacnetObject } from '../core/bacnet-object-generator';
import { TSLInfoMap } from '../../parser';

/**
 * Fixer 上下文
 */
export interface FixerContext {
	/** 物模型数据映射（可选，用于动态生成属性） */
	tslInfoMap?: TSLInfoMap;
	/** IPSO 版本 */
	ipsoVersion?: 'v1' | 'v2';
}

/**
 * Fixer 接口
 */
export interface Fixer {
	/**
	 * 处理 BACnet 对象列表
	 * @param objects BACnet 对象列表
	 * @param context 上下文信息（可选）
	 * @returns 处理后的 BACnet 对象列表
	 */
	process(objects: BacnetObject[], context?: FixerContext): BacnetObject[];

	/**
	 * 获取 fixer 名称
	 */
	getName(): string;
}

/**
 * Fixer 基类
 */
export abstract class BaseFixer implements Fixer {
	abstract process(objects: BacnetObject[], context?: FixerContext): BacnetObject[];
	abstract getName(): string;
}
`,$=`/**
 * 黑白名单修复器
 * 负责过滤掉不需要出现在 codec.json 中的属性
 *
 * 修复规则：
 *
 * 1. ID 模式匹配过滤：
 *    - 支持前缀匹配：如 "cellular_settings." 会过滤所有以此开头的 ID
 *    - 支持完全匹配：如 "temp_sensor" 只过滤完全匹配的 ID
 *    - 支持通配符匹配：如 "*.test" 会过滤所有以 .test 结尾的 ID
 *
 * 2. 白名单优先：
 *    - 白名单中的 ID 不会被过滤，即使匹配黑名单规则
 *    - 例如：黑名单包含 "lorawan_configuration_settings."，但白名单包含 "lorawan_configuration_settings.mode"
 *      则 lorawan_configuration_settings.mode 不会被过滤
 *
 * 3. 黑名单配置：
 *    - 默认黑名单在 DEFAULT_BLACKLIST 中定义
 *    - 默认白名单在 DEFAULT_WHITELIST 中定义
 *    - 可以通过构造函数传入自定义黑名单和白名单
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * 默认黑名单：需要过滤的 ID 模式列表
 */
const DEFAULT_BLACKLIST = [
	'cellular_settings.', // 过滤所有蜂窝配置的属性
	'lorawan_configuration_settings.', // 过滤所有 LoRaWAN 配置的属性
	'command_queries_reply.', // 过滤所有命令查询回复的属性
	'request_command_queries.', // 过滤所有命令查询请求的属性
	'full_inspection.', // 过滤所有全检请求的属性
	'full_inspection_reply.', // 过滤所有全检回复的属性
] as const;

/**
 * 默认白名单：即使匹配黑名单也不过滤的 ID 列表
 */
const DEFAULT_WHITELIST = [
	'lorawan_configuration_settings.mode', // 保留 LoRaWAN 模式配置
] as const;

/**
 * 黑白名单修复器
 */
export class BlacklistWhitelistFixer extends BaseFixer {
	private blacklist: readonly string[];
	private whitelist: readonly string[];

	constructor(blacklist: readonly string[] = DEFAULT_BLACKLIST, whitelist: readonly string[] = DEFAULT_WHITELIST) {
		super();
		this.blacklist = blacklist;
		this.whitelist = whitelist;
	}

	getName(): string {
		return 'BlacklistWhitelistFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		return objects.filter(obj => !this.isBlacklisted(obj.id));
	}

	/**
	 * 判断 ID 是否在黑名单中
	 */
	private isBlacklisted(id: string): boolean {
		// 白名单优先：如果在白名单中，直接返回 false（不过滤）
		if (this.isWhitelisted(id)) {
			return false;
		}

		// 检查黑名单
		for (const pattern of this.blacklist) {
			if (this.matchPattern(id, pattern)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 判断 ID 是否在白名单中
	 */
	private isWhitelisted(id: string): boolean {
		return this.whitelist.includes(id);
	}

	/**
	 * 匹配模式
	 * - 如果 pattern 以 . 结尾，视为前缀匹配
	 * - 如果 pattern 包含 *，视为通配符匹配
	 * - 否则视为完全匹配
	 */
	private matchPattern(id: string, pattern: string): boolean {
		// 前缀匹配：pattern 以 . 结尾
		if (pattern.endsWith('.')) {
			return id.startsWith(pattern);
		}

		// 通配符匹配：pattern 包含 *
		if (pattern.includes('*')) {
			const regex = new RegExp('^' + pattern.replace(/\\*/g, '.*') + '$');
			return regex.test(id);
		}

		// 完全匹配
		return id === pattern;
	}
}
`,x=`/**
 * Fixer 管道
 * 按顺序执行多个 fixer
 */

import { BacnetObject } from '../core/bacnet-object-generator';
import { Fixer, FixerContext } from './base-fixer';
import { UnitFixer } from './unit-fixer';
import { ValueFixer } from './value-fixer';
import { ReferenceFixer } from './reference-fixer';
import { PropertyFixer } from './property-fixer';
import { BlacklistWhitelistFixer } from './blacklist-whitelist-fixer';
import { ParameterlessServiceFixer } from './parameterless-service-fixer';
import { TemperatureUnitFixer } from './temperature-unit-fixer';
import { SynchronizeTimeFixer } from './synchronize-time-fixer';
import { ValueNameUnitSymbolFixer } from './value-name-unit-symbol-fixer';

export class FixerPipeline {
	private fixers: Fixer[] = [];

	/**
	 * 添加 fixer
	 */
	addFixer(fixer: Fixer): this {
		this.fixers.push(fixer);
		return this;
	}

	/**
	 * 执行所有 fixer
	 */
	process(objects: BacnetObject[], context?: FixerContext): BacnetObject[] {
		let result = objects;

		for (const fixer of this.fixers) {
			result = fixer.process(result, context);
		}

		return result;
	}

	/**
	 * 创建默认 fixer 管道
	 * 包含所有标准 fixer
	 */
	static createDefault(): FixerPipeline {
		const pipeline = new FixerPipeline();

		// 按照执行顺序添加 fixer
		pipeline
			.addFixer(new ParameterlessServiceFixer()) // 无参数服务类型转换（OBJECT → BOOL）
			.addFixer(new UnitFixer())
			.addFixer(new TemperatureUnitFixer()) // 温度字段替换为 celsius/fahrenheit 变体，并同步温度引用
			.addFixer(new ValueFixer())
			.addFixer(new ValueNameUnitSymbolFixer()) // values[].name 温度符号全角转半角（℃/℉ → °C/°F）
			.addFixer(new ReferenceFixer())
			.addFixer(new PropertyFixer())
			.addFixer(new SynchronizeTimeFixer()) // synchronize_time 替换为固定 BACnet 写属性
			.addFixer(new BlacklistWhitelistFixer()); // 黑白名单过滤应该放在最后

		return pipeline;
	}
}
`,z=`/**
 * 无参数服务修复器
 * 负责修复没有参数的服务对象
 *
 * 修复规则：
 *
 * 1. 识别没有参数的服务：
 *    - data_type = "OBJECT" 且 value_type = "STRUCT"
 *    - access_mode = "W"
 *    - 通常是服务的父节点
 *
 * 2. 转换为 BOOL 类型：
 *    - data_type: OBJECT → BOOL
 *    - value_type: STRUCT → UINT8
 *    - bacnet_type: undefined → binary_output_object
 *    - 添加固定的 values: [{ value: 0, name: "no" }, { value: 1, name: "yes" }]
 *    - value: 设置为空字符串 ""
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * 无参数服务修复器
 */
export class ParameterlessServiceFixer extends BaseFixer {
	getName(): string {
		return 'ParameterlessServiceFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		for (const obj of objects) {
			if (this.isParameterlessService(obj)) {
				this.convertToBoolType(obj);
			}
		}
		return objects;
	}

	/**
	 * 判断是否是没有参数的服务
	 */
	private isParameterlessService(obj: BacnetObject): boolean {
		return (
			obj.data_type === 'OBJECT' &&
			obj.value_type === 'STRUCT' &&
			obj.access_mode === 'W' &&
			!obj.bacnet_type // 服务父节点没有 bacnet_type
		);
	}

	/**
	 * 将服务对象转换为 BOOL 类型
	 */
	private convertToBoolType(obj: BacnetObject): void {
		// 修改数据类型
		obj.data_type = 'BOOL';
		obj.value_type = 'UINT8';
		obj.bacnet_type = 'binary_output_object';

		// 设置默认值
		obj.value = '';

		// 添加固定的 yes/no 枚举值
		obj.values = [
			{ value: 0, name: 'no' },
			{ value: 1, name: 'yes' },
		];
	}
}
`,Y=`/**
 * 基础属性修复器
 * 负责修复 codec.json 的基础属性
 *
 * 修复规则：
 *
 * 1. IPSO 版本支持：
 *    - IPSO v1: 不添加任何基础属性（返回空数组）
 *    - IPSO v2 或未指定: 添加完整的基础属性列表
 *
 * 2. 添加必需的基础属性（仅 IPSO v2）：
 *    - 必需属性列表：tsl_version, product_sn, version.hardware_version, version.firmware_version, oem_id
 *    - 如果物模型表中存在这些属性，则从表中动态生成
 *    - 如果不存在，则不添加
 *    - 基础属性会被添加到 codec.json 的开头
 *
 * 3. 过滤标记处理：
 *    - 这些基础属性在物模型表中可能被标记为 showInToolbox=false 或 ignoreRow=1
 *    - 正常生成流程会将它们标记为 hidden=true 并过滤掉
 *    - PropertyFixer 使用 filterForCodec=false 强制生成这些属性，确保它们始终出现在 codec.json 中
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';
import { TSLInfoMap } from '../../parser';
import { TslConverter } from '../core/tsl-converter';
import { BacnetObjectGenerator } from '../core/bacnet-object-generator';

/**
 * 根据 IPSO 版本获取必需的基础属性 ID 列表
 */
function getRequiredBasicPropertyIds(ipsoVersion?: 'v1' | 'v2'): readonly string[] {
	if (ipsoVersion === 'v1') {
		return [];
	}

	return [
		'tsl_version',
		'product_sn',
		'version.hardware_version',
		'version.firmware_version',
		'oem_id',
	];
}

/**
 * 基础属性修复器
 */
export class PropertyFixer extends BaseFixer {
	getName(): string {
		return 'PropertyFixer';
	}

	process(objects: BacnetObject[], context?: FixerContext): BacnetObject[] {
		const allIds = objects.map(obj => obj.id);
		const basicProperties = this.getBasicProperties(allIds, context?.tslInfoMap, context?.ipsoVersion);

		// 将基础属性添加到列表开头
		return [...basicProperties, ...objects];
	}

	/**
	 * 获取基础属性列表
	 */
	private getBasicProperties(existingIds: string[], tslInfoMap?: TSLInfoMap, ipsoVersion?: 'v1' | 'v2'): BacnetObject[] {
		const basicProperties: BacnetObject[] = [];
		const requiredIds = getRequiredBasicPropertyIds(ipsoVersion);

		for (const propertyId of requiredIds) {
			// 如果已存在，跳过
			if (existingIds.includes(propertyId)) {
				continue;
			}

			// 尝试从物模型表中查找
			const bacnetObject = this.findPropertyFromTslInfoMap(propertyId, tslInfoMap);

			if (bacnetObject) {
				// 从物模型表找到，使用动态生成的值
				basicProperties.push(bacnetObject);
			}
			// 如果未找到，不添加（不设置默认值）
		}

		return basicProperties;
	}

	/**
	 * 从物模型表中查找属性并生成 BacnetObject
	 */
	private findPropertyFromTslInfoMap(propertyId: string, tslInfoMap?: TSLInfoMap): BacnetObject | null {
		if (!tslInfoMap) {
			return null;
		}

		// 遍历所有 IPSO 通道，查找匹配的 propertyId
		for (const tslInfos of Object.values(tslInfoMap)) {
			for (const tslInfo of tslInfos) {
				if (tslInfo.propertyId === propertyId) {
					// 找到匹配的属性，使用 codec 生成逻辑生成
					return this.generateBacnetObjectFromTslInfo(tslInfo);
				}
			}
		}

		return null;
	}

	/**
	 * 从 TSL 信息生成 BacnetObject
	 */
	private generateBacnetObjectFromTslInfo(tslInfo: any): BacnetObject {
		// 转换为 ThingSpec 格式，使用 filterForCodec=false 确保不过滤
		const thingSpec = TslConverter.convertToThingSpec({ [tslInfo.ipsoChannel || '0x0000']: [tslInfo] }, false);

		// 使用 BacnetObjectGenerator 生成
		const generator = new BacnetObjectGenerator({
			thingSpec,
		});

		const objects = generator.generate();

		// 返回第一个对象（应该只有一个）
		return objects[0] || null;
	}
}
`,K=`/**
 * Reference 修复器
 * 负责修复 codec 对象的 reference 字段
 *
 * 修复规则：
 *
 * 1. 父级 ID 扩展：
 *    - 如果 reference 中的某个 ID 是父级 ID（存在以 "父级ID." 开头的子级 ID）
 *    - 则将该父级 ID 替换为所有子级 ID
 *    - 示例：reference: ["interface_settings"] → ["interface_settings.object", "interface_settings.baudrate"]
 *
 * 2. 保留规则：
 *    - 如果某个 ID 没有子级，则保留原 ID
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * Reference 修复器
 */
export class ReferenceFixer extends BaseFixer {
	getName(): string {
		return 'ReferenceFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		// 构建所有 ID 列表
		const allIds = objects.map(obj => obj.id);

		// 处理每个对象的 reference
		for (const obj of objects) {
			if (obj.reference) {
				obj.reference = this.expandReference(obj.reference, allIds);
			}
		}

		return objects;
	}

	/**
	 * 扩展 reference 数组
	 */
	private expandReference(references: string[], allIds: string[]): string[] {
		const expandedRefs: string[] = [];

		for (const ref of references) {
			let found = false;

			// 查找是否有以 ref. 开头的子级 ID
			for (const id of allIds) {
				if (id.startsWith(ref + '.')) {
					expandedRefs.push(id);
					found = true;
				}
			}

			// 如果没有找到子级，保留原 ID（但仅当该 ID 存在于 allIds 中时）
			if (!found) {
				// 只有当该 ID 真的存在时才保留
				if (allIds.includes(ref)) {
					expandedRefs.push(ref);
				}
			}
		}

		return expandedRefs;
	}
}
`,X=`/**
 * 同步时间修复器
 * 负责将 synchronize_time 对象替换为固定的 BACnet 写属性
 *
 * 修复规则：
 * - 触发条件：对象 id 为 'synchronize_time'
 * - 替换为 NUMBER/UINT8 类型，access_mode='W'
 * - range 固定为 [0, 255]
 * - BACnet 类型固定为 analog_output_object
 * - 单位固定为 UNITS_NO_UNITS
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * 同步时间修复器
 */
export class SynchronizeTimeFixer extends BaseFixer {
	getName(): string {
		return 'SynchronizeTimeFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		const result: BacnetObject[] = [];

		for (const obj of objects) {
            if (obj.id === 'synchronize_time') {
                result.push({
                    "id": "synchronize_time",
                    "name": "Synchronize Time",
                    "value": "",
                    "unit": "",
                    "access_mode": "W",
                    "data_type": "NUMBER",
                    "value_type": "UINT8",
                    "range": [0, 255],
                    "bacnet_type": "analog_output_object",
                    "bacnet_unit_type_id": 95,
                    "bacnet_unit_type": "UNITS_NO_UNITS"
                })
            } else {
                result.push(obj);
            }

		}
		return result;
	}
}
`,H=`/**
 * 温度单位修复器
 * 负责将温度字段替换为 celsius 和 fahrenheit 变体 BACnet 对象
 *
 * 修复规则：
 *
 * 1. 触发条件：
 *    - unit 为 '°C' 的字段（绝对温度）
 *    - unit 为 'K' 的字段（温度差值，数值仍为摄氏度）
 *    - 必须在 UnitFixer 之后执行（依赖标准化后的 unit 值）
 *
 * 2. 生成规则：
 *    - 对每个温度字段，不保留原始对象，只生成 2 个变体：
 *      - 摄氏度变体：
 *        - 绝对温度 unit='°C', bacnet_unit_type_id=62
 *        - 温度差值 unit='K', bacnet_unit_type_id=121
 *      - 华氏度变体：
 *        - 绝对温度 unit='°F', bacnet_unit_type_id=64
 *        - 温度差值 unit='ΔT°F', bacnet_unit_type_id=120
 *    - 非温度字段保持原样
 *    - ID 前缀规则：celsius_/fahrenheit_ 加在最后一段上
 *      - 示例: a.b.temperature → a.b.celsius_temperature
 *    - 其余字段（data_type, value_type, access_mode, bacnet_type 等）直接复制
 *    - 如果 reference 指向温度字段，则同步改为同单位变体引用：
 *      - celsius 变体引用 celsius_* 温度对象
 *      - fahrenheit 变体引用 fahrenheit_* 温度对象
 *
 * 3. range 转换：
 *    - celsius 变体: 与原始对象相同
 *    - fahrenheit 变体:
 *      - °C（绝对温度）: value * 9/5 + 32
 *      - K（温度差值）: value * 9/5（不加 32）
 *
 * 4. value（默认值）转换：
 *    - celsius 变体: 与原始对象相同
 *    - fahrenheit 变体: 同 range 转换公式
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * 温度单位修复器
 */
export class TemperatureUnitFixer extends BaseFixer {
	// 绝对温度（摄氏度）
	private static readonly CELSIUS_UNIT = '°C';
	// 温度差值（单位标记为 K，数值仍为摄氏度差值）
	private static readonly DELTA_UNIT = 'K';

	getName(): string {
		return 'TemperatureUnitFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		const result: BacnetObject[] = [];

		for (const obj of objects) {
			// 温度字段不保留原对象，只保留摄氏度和华氏度变体。
			if (this.isTemperatureUnit(obj.unit) && !this.isTemperatureVariant(obj.id)) {
				const isDelta = obj.unit === TemperatureUnitFixer.DELTA_UNIT;
				result.push(this.createCelsiusVariant(obj, isDelta, objects));
				result.push(this.createFahrenheitVariant(obj, isDelta, objects));
			} else {
				result.push(obj);
			}
		}

		return result;
	}

	/**
	 * 判断是否是温度相关单位
	 */
	private isTemperatureUnit(unit: string | undefined): boolean {
		if (!unit) return false;
		return unit === TemperatureUnitFixer.CELSIUS_UNIT || unit === TemperatureUnitFixer.DELTA_UNIT;
	}

	/**
	 * 判断是否是已生成的温度单位变体。
	 * 变体仍可能使用 °C 或 K，因此不能仅根据 unit 判断，避免重复执行
	 * --fix-codec 时继续添加 celsius_/fahrenheit_ 前缀。
	 */
	private isTemperatureVariant(id: string): boolean {
		const lastSegment = id.substring(id.lastIndexOf('.') + 1);
		return lastSegment.startsWith('celsius_') || lastSegment.startsWith('fahrenheit_');
	}

	/**
	 * 给 ID 的最后一段添加前缀
	 * 示例: prefixLastSegment('a.b.temperature', 'celsius') → 'a.b.celsius_temperature'
	 * 示例: prefixLastSegment('temperature', 'celsius') → 'celsius_temperature'
	 */
	private prefixLastSegment(id: string, prefix: string): string {
		const dotIndex = id.lastIndexOf('.');
		if (dotIndex === -1) {
			return \`\${prefix}_\${id}\`;
		}
		return \`\${id.substring(0, dotIndex + 1)}\${prefix}_\${id.substring(dotIndex + 1)}\`;
	}

	/**
	 * 创建摄氏度变体对象，并把温度引用同步改为 celsius_* 变体
	 */
	private createCelsiusVariant(original: BacnetObject, isDelta: boolean, allObjects: BacnetObject[]): BacnetObject {
		const unit = isDelta ? 'K' : '°C';
        const bacnet_unit_type_id = isDelta ? 121 : 62;
        const bacnet_unit_type = isDelta ? 'UNITS_DELTA_DEGREES_KELVIN' : 'UNITS_DEGREES_CELSIUS';
		const variant: BacnetObject = {
			...original,
			id: this.prefixLastSegment(original.id, 'celsius'),
			name: \`Celsius \${original.name}\`,
			unit: unit,
			bacnet_unit_type_id: bacnet_unit_type_id,
			bacnet_unit_type: bacnet_unit_type,
		};

		if (original.range) {
			variant.range = [...original.range] as [number, number];
		}

		if (original.reference) {
            const fixedReference: string[] = [];
            for (const ref of original.reference) {
                const refObj = allObjects.find(obj => obj.id === ref);
                if (refObj && this.isTemperatureUnit(refObj.unit)) {
                    fixedReference.push(this.prefixLastSegment(ref, 'celsius'));
                } else {
                    fixedReference.push(ref);
                }
            }
			variant.reference = fixedReference;
		}

		return variant;
	}

	/**
	 * 创建华氏度变体对象，并把温度引用同步改为 fahrenheit_* 变体
	 */
	private createFahrenheitVariant(original: BacnetObject, isDelta: boolean, allObjects: BacnetObject[]): BacnetObject {
		const unit = isDelta ? 'ΔT°F' : '°F';
        const bacnet_unit_type_id = isDelta ? 120 : 64;
        const bacnet_unit_type = isDelta ? 'UNITS_DELTA_DEGREES_FAHRENHEIT' : 'UNITS_DEGREES_FAHRENHEIT';
		const variant: BacnetObject = {
			...original,
			id: this.prefixLastSegment(original.id, 'fahrenheit'),
			name: \`Fahrenheit \${original.name}\`,
			unit: unit,
			bacnet_unit_type_id: bacnet_unit_type_id,
			bacnet_unit_type: bacnet_unit_type,
		};

		// 默认值转换
		if (original.value != null && original.value !== '') {
			variant.value = this.convertValueToFahrenheit(original.value, isDelta);
		}

		if (original.range) {
			variant.range = isDelta
				? this.convertDeltaRangeToFahrenheit(original.range)
				: this.convertRangeToFahrenheit(original.range);
		}

		if (original.reference) {
            const fixedReference: string[] = [];
            for (const ref of original.reference) {
                const refObj = allObjects.find(obj => obj.id === ref);
                if (refObj && this.isTemperatureUnit(refObj.unit)) {
                    fixedReference.push(this.prefixLastSegment(ref, 'fahrenheit'));
                } else {
                    fixedReference.push(ref);
                }
            }
			variant.reference = fixedReference;
		}

		return variant;
	}

	/**
	 * 默认值转换: °C → °F
	 * 绝对温度: value * 9/5 + 32, 差值: value * 9/5
	 */
	private convertValueToFahrenheit(value: string, isDelta: boolean): string {
		const num = parseFloat(value);
		if (isNaN(num)) return value;

		const converted = isDelta
			? Math.round(num * 9 / 5 * 100) / 100
			: Math.round((num * 9 / 5 + 32) * 100) / 100;

		return String(converted);
	}

	/**
	 * 绝对温度范围转换: °C → °F
	 * 公式: value * 9/5 + 32
	 */
	private convertRangeToFahrenheit(range: [number, number]): [number, number] {
		return [
			Math.round((range[0] * 9 / 5 + 32) * 100) / 100,
			Math.round((range[1] * 9 / 5 + 32) * 100) / 100,
		];
	}

	/**
	 * 温度差值范围转换: ΔC → ΔF
	 * 公式: value * 9/5（不加 32）
	 */
	private convertDeltaRangeToFahrenheit(range: [number, number]): [number, number] {
		return [
			Math.round((range[0] * 9 / 5) * 100) / 100,
			Math.round((range[1] * 9 / 5) * 100) / 100,
		];
	}
}
`,q=`/**
 * 单位修复器
 * 负责修复 codec 对象的单位相关字段（unit, bacnet_unit_type_id, bacnet_unit_type）
 *
 * 修复规则：
 *
 * 1. 单位名称标准化（unit 字段）：
 *    - 将物模型表中的单位别名转换为 BACnet 标准格式
 *    - 示例：℃ → °C, degC → °C, lux → lx
 *
 * 2. 修复流程：
 *    - 优先通过 unit 名称修复（支持别名标准化，忽略大小写）
 *    - 如果找到匹配的 BACnet 单位定义，更新 unit、bacnet_unit_type、bacnet_unit_type_id
 *    - 如果通过 unit 无法修复，尝试根据 bacnet_unit_type_id 查找并修复
 *
 * 3. 忽略规则：
 *    - bacnet_unit_type_id = 95 (UNITS_NO_UNITS) 不需要修复
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';
import { bacnet_units_def } from 'codec-validator-action';

/**
 * 单位修复器
 */
export class UnitFixer extends BaseFixer {
	// 忽略的单位类型 ID（95 是 UNITS_NO_UNITS，不需要修复）
	private static readonly IGNORE_TYPE_IDS = new Set([95]);

	// BACnet 单位定义映射表（按 unit_type_id 索引）
	private static readonly unitDefByTypeId: Map<number, typeof bacnet_units_def[0]> = new Map(bacnet_units_def.map(def => [def.unit_type_id, def]));

	// BACnet 单位定义映射表（按单位名称的大写形式索引）
	private static readonly unitDefByUpperUnit: Map<string, typeof bacnet_units_def[0]> = new Map(bacnet_units_def.map(def => [def.unit.toUpperCase(), def]));

	getName(): string {
		return 'UnitFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		for (const obj of objects) {
			this.fixObjectUnit(obj);
		}
		return objects;
	}

	/**
	 * 标准化单位名称
	 */
	private static normalizeUnit(unitName: string | undefined): string {
		if (!unitName) return '';

		// 单位映射表：物模型表单位别名 -> BACnet 标准单位
		//https://github.com/Milesight-IoT/codec/blob/release/bacnet_unit.md
		const unitNormalization: Record<string, string> = {
			'℃': '°C', // 全角摄氏度 -> 半角
			'℉': '°F', // 全角华氏度 -> 半角
			'ug/m3': 'µg/m³',
			Lux: 'lx', // 常见别名 -> BACnet 标准
			lux: 'lx', // 常见别名 -> BACnet 标准
		};

		return unitNormalization[unitName] || unitName;
	}

	/**
	 * 根据单位名称获取单位定义
	 */
	private static getUnitDefByName(unit: string): typeof bacnet_units_def[0] | undefined {
		// 先尝试标准化单位（处理常见别名）
		const normalized = this.normalizeUnit(unit);

		// 优先查找标准化后的单位（忽略大小写）
		const def = this.unitDefByUpperUnit.get(normalized.toUpperCase());
		if (def) return def;

		// 最后尝试原始单位名（忽略大小写）
		return this.unitDefByUpperUnit.get(unit.toUpperCase());
	}

	/**
	 * 修复单个对象的单位信息
	 */
	private fixObjectUnit(obj: BacnetObject): void {
		const { unit, bacnet_unit_type_id } = obj;

		// 优先通过 unit 名称修复（支持别名标准化，如 "℃" → "°C"）
		if (unit && unit.trim() !== '') {
			const unitDef = UnitFixer.getUnitDefByName(unit);
			if (unitDef) {
				// 统一修改为 BACnet 标准单位格式
				obj.unit = unitDef.unit;
				obj.bacnet_unit_type = unitDef.unit_type;
				obj.bacnet_unit_type_id = unitDef.unit_type_id;
				return;
			}
		}

		// 如果通过 unit 名称无法修复，尝试根据 bacnet_unit_type_id 修复
		if (typeof bacnet_unit_type_id === 'number' && !UnitFixer.IGNORE_TYPE_IDS.has(bacnet_unit_type_id)) {
			const unitDef = UnitFixer.unitDefByTypeId.get(bacnet_unit_type_id);
			if (unitDef) {
				// 统一修改为 BACnet 标准单位格式
				obj.unit = unitDef.unit;
				obj.bacnet_unit_type = unitDef.unit_type;
			}
		}
	}
}
`,Z=`/**
 * 枚举值修复器
 * 负责修复 codec 对象的 values 字段
 *
 * 修复规则：
 *
 * 1. 字段顺序标准化：
 *    - 将 values 数组中每个对象的字段重排序为 {value, name} 顺序
 *    - 确保 value 字段在前，name 字段在后
 *
 * 2. 特殊处理：
 *    - 如果 id 以 .reserved 结尾且 values 为空，自动添加 enable/disable 枚举值
 *    - 如果 values 数组只有一个数值枚举，自动补充 value + 1 的 Unsupported 枚举值
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * 枚举值修复器
 */
export class ValueFixer extends BaseFixer {
	getName(): string {
		return 'ValueFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		for (const obj of objects) {
			this.fixReservedValues(obj);
			this.reorderValues(obj);
		}
		return objects;
	}

	/**
	 * 修复 reserved 字段的默认枚举值
	 * 如果 id 以 .reserved 结尾且 values 为空，添加默认的 enable/disable 枚举值
	 */
	private fixReservedValues(obj: BacnetObject): void {
		// 检查 id 是否以 .reserved 结尾
		if (!obj.id.endsWith('.reserved')) return;

		// 检查 values 是否为空（undefined、null 或空数组）
		if (obj.values && obj.values.length > 0) return;

		// 添加默认的 enable/disable 枚举值
		obj.values = [
			{
				value: 0,
				name: 'disable',
			},
			{
				value: 1,
				name: 'enable',
			},
		];
	}

	/**
	 * 重排序 values 字段
	 */
	private reorderValues(obj: BacnetObject): void {
		const values = obj.values;

		// must be an array
		if (!Array.isArray(values)) return;

		// must be array of objects
		if (!values.every(v => typeof v === 'object' && v !== null)) return;

		// must contain name/value
		if (!values.every(v => 'name' in v && 'value' in v)) return;

		if (values.length === 1 && typeof values[0].value === 'number') {
			values.push({
				value: values[0].value + 1,
				name: 'Unsupported Command',
			});
		}

		if (values.length < 2) {
			throw new Error(
				\`对象 \${obj.id} 的 values 数组长度必须至少为 2，且唯一枚举值必须为数值，请修改物模型。\`,
			);
		}

		// Reorder: value 在前，name 在后
		obj.values = values.map((v: any) => ({
			value: v.value,
			name: v.name,
		}));
	}
}
`,Q=`/**
 * 枚举 name 单位符号修复器
 * 负责将 values[].name 中软件不识别的全角温度符号改为半角形式
 *
 * 修复规则：
 *
 * 1. 触发条件：
 *    - 任意对象存在 values 数组
 *    - values[].name 为 '℃' 或 '℉'
 *
 * 2. 替换规则：
 *    - ℃ → °C
 *    - ℉ → °F
 */

import { BaseFixer, FixerContext } from './base-fixer';
import { BacnetObject } from '../core/bacnet-object-generator';

/**
 * 枚举 name 单位符号修复器
 */
export class ValueNameUnitSymbolFixer extends BaseFixer {
	private static readonly NAME_NORMALIZATION: Record<string, string> = {
		'℃': '°C',
		'℉': '°F',
	};

	getName(): string {
		return 'ValueNameUnitSymbolFixer';
	}

	process(objects: BacnetObject[], _context?: FixerContext): BacnetObject[] {
		for (const obj of objects) {
			this.fixValuesNames(obj);
		}
		return objects;
	}

	/**
	 * 修复单个对象 values[].name 中的温度符号
	 */
	private fixValuesNames(obj: BacnetObject): void {
		const values = obj.values;
		if (!Array.isArray(values)) return;

		for (const item of values) {
			if (!item || typeof item !== 'object' || typeof item.name !== 'string') continue;

			const normalized = ValueNameUnitSymbolFixer.NAME_NORMALIZATION[item.name];
			if (normalized) {
				item.name = normalized;
			}
		}
	}
}
`,nn=`# CodecJson 字段转换规则文档

> 本文档面向测试人员和业务人员，详细说明每个字段的转换规则、数据来源和测试用例。

## 目录

0. [哪些字段可以生成到 Codec](#0-哪些字段可以生成到-codec)
1. [Builder 转换规则](#builder-转换规则)
   - [PropertyBasicBuilder](#1-propertybasicbuilder)
   - [AccessModeBuilder](#2-accessmodebuilder)
   - [DefaultValueBuilder](#3-defaultvaluebuilder)
   - [DataTypeBuilder](#4-datatypebuilder)
   - [UnitBuilder](#5-unitbuilder)
   - [MaxLengthBuilder](#6-maxlengthbuilder)
   - [RangeBuilder](#7-rangebuilder)
   - [ValuesBuilder](#8-valuesbuilder)
   - [ReferenceBuilder](#9-referencebuilder)
2. [Fixer 修复规则](#fixer-修复规则)
   - [ParameterlessServiceFixer](#1-parameterlessservicefixer)
   - [UnitFixer](#2-unitfixer)
   - [ValueFixer](#3-valuefixer)
   - [ReferenceFixer](#4-referencefixer)
   - [PropertyFixer](#5-propertyfixer)
   - [BlacklistWhitelistFixer](#6-blacklistwhitelistfixer)

---

## 0. 哪些字段可以生成到 Codec

在生成 codec.json 之前，需要了解物模型维护表中的哪些字段会被包含在最终输出中。

### 过滤规则

**默认过滤条件**（\`filterForCodec = true\` 时）：

只有同时满足以下两个条件的字段才会被包含：
1. ✅ **\`platformCustom = true\`**（平台自定义字段标记为是）
2. ✅ **\`ignoreRow != 1\`**（忽略该行标记不为1）

**不满足条件的字段会被标记为 \`hidden = true\`**，并在后续生成阶段被过滤掉。

**额外过滤规则**：

- ❌ **ARRAY 类型字段会被跳过**：所有 \`dataType = ARRAY\` 的字段不会生成到 codec.json 中（\`skipArrayNode = true\`）
- ❌ **关联项字段会去重**：当字段存在 \`relatedPropertyId\`，且该关联目标字段也在可生成候选集中时，当前字段不会生成到 codec.json（仅保留关联目标字段定义）

### 特殊情况

#### 1. 基础属性字段（IPSO v2）

以下字段即使 \`platformCustom = false\` 或 \`ignoreRow = 1\`，也会被强制包含（由 PropertyFixer 处理）：

- \`tsl_version\`
- \`product_sn\`
- \`version.hardware_version\`
- \`version.firmware_version\`
- \`oem_id\`

**说明**：这些是设备的基础信息字段，PropertyFixer 使用 \`filterForCodec=false\` 强制生成。

#### 2. Hidden 字段的作用

被标记为 \`hidden=true\` 的字段作为**辅助字段**使用：
- ❌ 不会出现在最终的 codec.json 中
- ✅ 但它们的 \`ipsoAuxiliaryFieldType\` 类型信息会被用于判断和构建其他字段的 reference 关系

**示例**：如果 \`humidity_alarm.type\` 被标记为 \`hidden=true\` 且类型为 \`type(one_of)\`，虽然它不会出现在 codec.json 中，但系统会识别到存在 \`type(one_of)\` 字段，从而影响同级其他字段的 reference 构建规则。

对于**无参数 service 父节点**（如 \`request_query_all_configurations\`）：
- service 父行的 \`hidden\` 状态会同步到 service 元信息
- 当父行为 \`hidden=true\` 时，不会生成该 service 父节点对象
- 只有 \`hidden!==true\` 的无参数 service 才会进入后续 \`ParameterlessServiceFixer\`（OBJECT → BOOL）

### 测试检查清单

在测试时，请检查以下内容：

- [ ] 所有 \`platformCustom=true\` 且 \`ignoreRow!=1\` 的字段都出现在 codec.json 中
- [ ] 所有 \`platformCustom=false\` 或 \`ignoreRow=1\` 的字段都不出现在 codec.json 中（除了基础属性）
- [ ] \`platformCustom=false\` 的无参数 service 父节点（如 \`request_query_all_configurations\`）不出现在 codec.json 中
- [ ] 所有 \`dataType=ARRAY\` 的字段都不出现在 codec.json 中
- [ ] 存在 \`relatedPropertyId\` 的字段：若关联目标字段也可生成，则当前字段不出现在 codec.json
- [ ] 基础属性字段（IPSO v2）始终出现，即使被标记为隐藏
- [ ] Hidden 字段不会被用作其他字段的 reference 目标

---

## Builder 转换规则

Builder 负责将物模型维护表的数据转换为 codec.json 的各个字段。

### 1. PropertyBasicBuilder

**负责字段**：\`id\`, \`name\`, \`description\`

**数据来源**：物模型维护表

**转换规则**：

| 输入字段 | 输出字段 | 转换规则 |
|---------|---------|---------|
| \`propertyId\` | \`id\` | 直接使用；若为空则使用 \`prop_\${ipsoChannel}\` 作为后备 |
| \`name\` | \`name\` | 优先使用 \`name\`（为空时回退 \`propertyId\`）；若字段存在父级且可找到父级英文名，则输出 \`name(parentName)\` |
| \`description\` | \`description\` | 去除前后空格，如果为空则不输出 |

**name 拼接父级名称示例**：

- 子字段：\`temperature_alarm.high_threshold\`，\`name = High Threshold\`
- 父字段：\`temperature_alarm\`，\`name = Temperature Alarm\`
- 最终输出：\`High Threshold(Temperature Alarm)\`

---

### 2. AccessModeBuilder

**负责字段**：\`access_mode\`

**数据来源**：物模型维护表 - 读写类型 (readWriteType)

**转换规则**：

| 输入 readWriteType | 输出 access_mode | 说明 |
|-------------------|-----------------|------|
| \`"r"\` / \`"R"\` | \`"R"\` | 只读 |
| \`"w"\` / \`"W"\` | \`"W"\` | 只写 |
| \`"rw"\` / \`"RW"\` | \`"RW"\` | 读写 |
| 空 / 其他 | \`"R"\` | 默认只读 |

---

### 3. DefaultValueBuilder

**负责字段**：\`value\`（默认值）

**数据来源**：物模型维护表 - 默认值 (defaultValue)

**转换规则**：

#### 1. 优先使用指定的默认值（如果有提供）

- **BOOL 类型特殊处理**：
  - \`"true"\` 或 \`"1"\` → \`"1"\`
  - \`"false"\` 或 \`"0"\` → \`"0"\`
  - 其他无效值 → \`""\` (空字符串)
- **其他类型**：直接转换为字符串

#### 2. 如果没有指定默认值，根据数据类型生成

| 数据类型 | 默认值 | 说明 |
|---------|-------|------|
| \`TEXT\` / \`STRING\` | \`""\` | 空字符串 |
| \`BOOL\` | \`"0"\` | 假 |
| \`NUMBER\` / \`INT\` / \`LONG\` / \`FLOAT\` / \`DOUBLE\` | \`""\` | 空字符串 |
| \`ENUM\` | \`""\` | 空字符串 |
| \`STRUCT\` / \`ARRAY\` | \`""\` | 空字符串 |
| 其他类型 | \`""\` | 空字符串 |

### 4. DataTypeBuilder

**负责字段**：\`data_type\`, \`value_type\`, \`bacnet_type\`

**数据来源**：物模型维护表 - 物模型数据类型 (tslDataType)

#### 4.1 data_type 转换规则

**转换步骤**（两步转换）：

##### 第一步：物模型类型 → TSL 内部类型

| 物模型类型 | TSL 内部类型 | 说明 |
|-----------|-------------|------|
| \`int\` | \`INT\` | 整数 |
| \`long\` | \`LONG\` | 长整数 |
| \`float\` | \`FLOAT\` | 单精度浮点数 |
| \`double\` | \`DOUBLE\` | 双精度浮点数 |
| \`date\` | \`LONG\` | 时间戳（用长整型表示）|
| \`local_time\` | \`INT\` | 本地时间（用整数表示）|
| \`string\` | \`STRING\` | 字符串 |
| \`bool\` / \`boolean\` | \`BOOL\` | 布尔值 |
| \`enum\` | \`ENUM\` | 枚举 |
| \`struct\` | \`STRUCT\` | 结构体 |
| \`array\` | \`ARRAY\` | 数组 |

##### 第二步：TSL 内部类型 → BACnet data_type

| TSL 类型 | BACnet data_type | 说明 |
|---------|------------------|------|
| \`INT\` / \`LONG\` / \`FLOAT\` / \`DOUBLE\` | \`NUMBER\` | 数值类型统一 |
| \`STRING\` | \`TEXT\` | 文本类型 |
| \`BOOL\` | \`BOOL\` | 布尔类型 |
| \`ENUM\` | \`ENUM\` | 枚举类型 |
| \`STRUCT\` | \`OBJECT\` | 对象类型 |
| \`ARRAY\` | \`ARRAY\` | 数组类型 |

#### 4.2 value_type 推导规则

**数据来源**：根据 data_type、min/max 范围、枚举值、系数等信息推导

**推导逻辑**：

1. **容器类型**（STRUCT/ARRAY）→ \`STRUCT\`
2. **字符串类型**（STRING）→ \`STRING\`
3. **有系数**（coefficient > 0）→ \`FLOAT\`（浮点类型）
4. **BOOL 类型** → \`UINT8\`
5. **ENUM 类型** → 根据枚举值的范围推导
6. **NUMBER 类型** → 根据 min/max 范围推导

**范围映射表**：

| 范围 | 无符号类型 | 有符号类型 |
|------|-----------|-----------|
| 0 ~ 255 | \`UINT8\` | \`INT8\` (-128 ~ 127) |
| 0 ~ 65535 | \`UINT16\` | \`INT16\` (-32768 ~ 32767) |
| 0 ~ 4294967295 | \`UINT32\` | \`INT32\` (-2147483648 ~ 2147483647) |
| 更大范围 | \`UINT64\` | \`INT64\` |

**推导规则**：
- 如果 max 为空，默认返回 \`UINT8\`
- 如果 min < 0 或 min 为空，使用有符号类型
- 否则使用无符号类型
- 根据 max 值的大小选择合适的位宽

#### 4.3 bacnet_type 推导规则

**数据来源**：根据 data_type 和 access_mode 推导

| data_type | access_mode | bacnet_type |
|-----------|-------------|-------------|
| \`TEXT\` | 任意 | \`character_string_value_object\` |
| \`ENUM\` | 任意 | \`multistate_value_object\` |
| \`NUMBER\` | \`R\` | \`analog_input_object\` |
| \`NUMBER\` | \`W\` | \`analog_output_object\` |
| \`NUMBER\` | \`RW\` | \`analog_value_object\` |
| \`BOOL\` | \`R\` | \`binary_input_object\` |
| \`BOOL\` | \`W\` | \`binary_output_object\` |
| \`BOOL\` | \`RW\` | \`binary_value_object\` |
| \`OBJECT\` / \`ARRAY\` | 任意 | 不输出该字段 |

---

### 5. UnitBuilder

**负责字段**：\`unit\`, \`bacnet_unit_type_id\`, \`bacnet_unit_type\`

**数据来源**：物模型维护表 - 单位名称 (unitName)

**转换规则**：

1. **如果 unit 为空** → \`95 (UNITS_NO_UNITS)\`
2. **如果 unit 为 \`'%'\`**：
   - 功率因数字段 → \`15 (UNITS_POWER_FACTOR)\`
   - 其他百分比 → \`98 (UNITS_PERCENT)\`
3. **查找 BACnet 标准单位表**，返回对应 ID 和名称
4. **未找到** → \`95 (UNITS_NO_UNITS)\`（由 UnitFixer 后续修复）

**功率因数识别**：通过 \`propertyId\` 或 \`propertyName\` 包含以下关键词判断：
- \`power_factor\`
- \`powerfactor\`
- \`pf\`
- \`功率因数\`

**BACnet 标准单位示例**（完整列表见 [bacnet_unit.md](https://github.com/Milesight-IoT/codec/blob/release/bacnet_unit.md)）：

| 单位符号 | bacnet_unit_type_id | bacnet_unit_type | 说明 |
|---------|---------------------|------------------|------|
| (空) | 95 | \`UNITS_NO_UNITS\` | 无单位 |
| \`°C\` | 62 | \`UNITS_DEGREES_CELSIUS\` | 摄氏度 |
| \`°F\` | 64 | \`UNITS_DEGREES_FAHRENHEIT\` | 华氏度 |
| \`%\` | 98 | \`UNITS_PERCENT\` | 百分比 |
| \`%\` (功率因数) | 15 | \`UNITS_POWER_FACTOR\` | 功率因数 |
| \`lx\` | 36 | \`UNITS_LUX\` | 照度 |
| \`W\` | 48 | \`UNITS_WATTS\` | 瓦特 |
| \`V\` | 5 | \`UNITS_VOLTS\` | 伏特 |
| \`A\` | 1 | \`UNITS_AMPERES\` | 安培 |
| \`kW\` | 47 | \`UNITS_KILOWATTS\` | 千瓦 |
| \`kWh\` | 19 | \`UNITS_KILOWATT_HOURS\` | 千瓦时 |
| \`m³\` | 159 | \`UNITS_CUBIC_METERS\` | 立方米 |
| \`ppm\` | 96 | \`UNITS_PARTS_PER_MILLION\` | 百万分率 |

---

### 6. MaxLengthBuilder

**负责字段**：\`max_length\`

**数据来源**：物模型维护表
- \`maxLengthLimit\`（列名：长度上限(string)）
- \`inputLengthLimit\`（列名：输入长度限制（string））

**转换规则**（仅用于 TEXT/STRING 类型）：

- 如果 \`data_type\` 不是 \`TEXT\`，不输出此字段
- 优先使用 \`maxLengthLimit\`
- 如果没有，使用 \`inputLengthLimit\`
- 如果都没有，不输出此字段

---

### 7. RangeBuilder

**负责字段**：\`range\`

**数据来源**：物模型维护表
- \`minValue\`（列名：最小值(number)）
- \`maxValue\`（列名：最大值(number)）

**转换规则**（仅用于数值类型）：

- 如果 \`data_type\` 不是 \`NUMBER\`，不输出此字段
- 浮点类型（FLOAT/DOUBLE）：保留原值
- 整数类型（INT/LONG）：向下取整（Math.floor）
- 如果 min 或 max 缺失，不输出此字段
- 输出类型：\`[number, number]\` 数组

### 8. ValuesBuilder

**负责字段**：\`values\`（枚举数组）

**数据来源**：物模型维护表 - 英文枚举 (enumDesc)

**转换规则**：

#### 7.1 解析 enumDesc 字符串

- **格式**：\`"0: Off, 1: On, 2: Auto"\`
- **分隔符**：\`,\` 和 \`:\`
- **支持前后空格**

#### 7.2 转换为数组

\`\`\`json
[
  {"value": 0, "name": "Off"},
  {"value": 1, "name": "On"},
  {"value": 2, "name": "Auto"}
]
\`\`\`

#### 7.3 value 字段处理

- 尝试解析为数字（支持十进制和十六进制，如 \`0x01\`）
- 解析失败则保持字符串

#### 7.4 name 字段处理

- 去除前后空格
- 保持原始大小写

**特殊情况**：

- 如果 \`enumDesc\` 为空但 \`dataType\` 为 \`ENUM\`：
  - 从 \`impl\` 类型的兄弟字段构建枚举
  - \`impl\` 字段的 \`ipsoMapping\` 提供枚举 key（支持十六进制）
  - \`impl\` 字段的 \`name\` 提供枚举 name

### 9. ReferenceBuilder

**负责字段**：\`reference\`（引用关系数组）

**数据来源**：根据物模型字段的层级关系和 \`ipsoAuxiliaryFieldType\`（列名：IPSO解析辅助）字段推导

**转换规则**：

#### 规则 1：顶层字段（层级 ≤ 1）

- **输出**：\`undefined\`（不输出 reference 字段）
- **说明**：顶层字段没有父级，不需要引用关系

**示例**：

\`\`\`
字段结构：
- temperature (顶层字段，层级=1)
- humidity (顶层字段，层级=1)
\`\`\`

生成结果：
\`\`\`json
{
  "id": "temperature",
  "name": "Temperature"
  // 不输出 reference 字段
}
\`\`\`

---

#### 规则 2：存在 type(one_of) 字段的情况

- **判断条件**：如果父级的子级存在 \`type(one_of)\` 字段
- **type(one_of) 字段本身**：\`reference = []\`（空数组）
- **其他同级字段**：\`reference = [type(one_of)字段的ID]\`

**示例**：

\`\`\`
字段结构：
- humidity_alarm.type (ipsoAuxiliaryFieldType: type(one_of))
- humidity_alarm.lower_range_alarm_deactivation (impl)
- humidity_alarm.lower_range_alarm_trigger (impl)
\`\`\`

生成结果：
\`\`\`json
[
  {
    "id": "humidity_alarm.type",
    "reference": []
  },
  {
    "id": "humidity_alarm.lower_range_alarm_deactivation",
    "reference": ["humidity_alarm.type"]
  },
  {
    "id": "humidity_alarm.lower_range_alarm_trigger",
    "reference": ["humidity_alarm.type"]
  }
]
\`\`\`

---

#### 规则 3：存在 type 字段（但不是 type(one_of)）

- **判断条件**：如果父级的子级存在 \`type\` 字段（但不是 \`type(one_of)\`）
- **输出**：\`reference\` = 自己的子级字段 ID（不包含其他同级字段）
- **无子级时**：返回空数组 \`[]\`

**示例**：

\`\`\`
字段结构：
- data_collection_settings (父级)
  - data_collection_settings.type (type 字段，但不是 type(one_of))
  - data_collection_settings.interval (同级字段)
    - data_collection_settings.interval.value (interval 的子级)
    - data_collection_settings.interval.unit (interval 的子级)
\`\`\`

生成结果：
\`\`\`json
[
  {
    "id": "data_collection_settings.type",
    "reference": []
  },
  {
    "id": "data_collection_settings.interval",
    "reference": [
      "data_collection_settings.interval.value",
      "data_collection_settings.interval.unit"
    ]
  }
]
\`\`\`

**说明**：\`interval\` 字段的 reference 只包含自己的子级字段，不包含同级的 \`type\` 字段。

---

#### 规则 4：默认情况

- **输出**：\`reference\` = 父级的其他子级字段 ID（排除自己）
- **无其他同级时**：返回空数组 \`[]\`

**示例 1（有其他同级字段）**：

\`\`\`
字段结构：
- network_settings (父级)
  - network_settings.ip_address
  - network_settings.subnet_mask
  - network_settings.gateway
\`\`\`

生成结果：
\`\`\`json
[
  {
    "id": "network_settings.ip_address",
    "reference": ["network_settings.subnet_mask", "network_settings.gateway"]
  },
  {
    "id": "network_settings.subnet_mask",
    "reference": ["network_settings.ip_address", "network_settings.gateway"]
  },
  {
    "id": "network_settings.gateway",
    "reference": ["network_settings.ip_address", "network_settings.subnet_mask"]
  }
]
\`\`\`

**示例 2（无其他同级字段）**：

\`\`\`
字段结构：
- device_info (父级)
  - device_info.serial_number (唯一的子级)
\`\`\`

生成结果：
\`\`\`json
{
  "id": "device_info.serial_number",
  "reference": []
}
\`\`\`

## Fixer 修复规则

Fixer 负责在生成基础 codec.json 后进行后处理修复和标准化。所有 Fixer 位于 \`src/codecJson/fixes/\` 目录下。

### 1. ParameterlessServiceFixer

**执行时机**：第 1 位（最先执行）

**职责**：修复没有参数的服务对象

**识别规则**：
- \`data_type\` = \`"OBJECT"\` 且 \`value_type\` = \`"STRUCT"\`
- \`access_mode\` = \`"W"\`
- 没有 \`bacnet_type\`（服务父节点）

**修复操作**：

| 字段 | 修复前 | 修复后 |
|-----|-------|-------|
| \`data_type\` | \`OBJECT\` | \`BOOL\` |
| \`value_type\` | \`STRUCT\` | \`UINT8\` |
| \`bacnet_type\` | 不存在 | \`binary_output_object\` |
| \`values\` | 不存在 | \`[{value: 0, name: "no"}, {value: 1, name: "yes"}]\` |
| \`value\` | 任意 | \`""\` |

**使用场景**：

无参数服务（如 \`reset_device\`、\`reboot\` 等）在生成阶段被识别为 \`OBJECT\` 类型，但实际应该是 BOOL 类型（0=不执行, 1=执行）。

注意：该修复器仅处理“已进入对象列表”的无参数 service。若 service 父行被标记为 \`hidden=true\`，则该 service 不会进入对象列表，也不会被此修复器处理。

**测试用例**：

修复前：
\`\`\`json
{
  "id": "reset_device",
  "name": "Reset Device",
  "data_type": "OBJECT",
  "value_type": "STRUCT",
  "access_mode": "W"
}
\`\`\`

修复后：
\`\`\`json
{
  "id": "reset_device",
  "name": "Reset Device",
  "data_type": "BOOL",
  "value_type": "UINT8",
  "access_mode": "W",
  "bacnet_type": "binary_output_object",
  "value": "",
  "values": [
    {"value": 0, "name": "no"},
    {"value": 1, "name": "yes"}
  ]
}
\`\`\`

---

### 2. UnitFixer

**执行时机**：第 2 位

**职责**：单位标准化

**别名映射**：

| 输入别名 | 标准单位 | 说明 |
|---------|---------|------|
| \`℃\` | \`°C\` | 全角转半角 |
| \`degC\` | \`°C\` | 别名转标准 |
| \`℉\` | \`°F\` | 全角转半角 |
| \`degF\` | \`°F\` | 别名转标准 |
| \`lux\` | \`lx\` | 别名转标准 |

**修复流程**：

1. 优先通过 \`unit\` 名称修复（支持别名，忽略大小写）
2. 找到匹配的 BACnet 单位定义，更新 \`unit\`, \`bacnet_unit_type\`, \`bacnet_unit_type_id\`
3. 如果通过 \`unit\` 无法修复，尝试根据 \`bacnet_unit_type_id\` 查找

**测试用例**：

| 修复前 unit | 修复前 bacnet_unit_type_id | 修复后 unit | 修复后 bacnet_unit_type_id | 修复后 bacnet_unit_type |
|-----------|-------------------------|-----------|--------------------------|----------------------|
| \`"℃"\` | \`95\` | \`"°C"\` | \`62\` | \`UNITS_DEGREES_CELSIUS\` |
| \`"degC"\` | \`95\` | \`"°C"\` | \`62\` | \`UNITS_DEGREES_CELSIUS\` |
| \`"lux"\` | \`95\` | \`"lx"\` | \`36\` | \`UNITS_LUX\` |
| \`"°C"\` | \`62\` | \`"°C"\` | \`62\` | \`UNITS_DEGREES_CELSIUS\` |
| \`"unknown"\` | \`95\` | \`"unknown"\` | \`95\` | \`UNITS_NO_UNITS\` |

---

### 3. ValueFixer

**执行时机**：第 3 位

**职责**：\`values\` 字段顺序规范化

**规则**：
- 将 \`values\` 数组中每个对象的字段重排序为 \`{value, name}\` 顺序
- 确保 \`value\` 字段在前，\`name\` 字段在后

**特殊处理**：
- 如果 \`values\` 长度小于 2，会复制一次（历史遗留逻辑，保证至少有 2 个选项）

**测试用例**：

**正常情况**：

修复前：
\`\`\`json
{
  "values": [
    {"name": "Off", "value": 0},
    {"name": "On", "value": 1}
  ]
}
\`\`\`

修复后：
\`\`\`json
{
  "values": [
    {"value": 0, "name": "Off"},
    {"value": 1, "name": "On"}
  ]
}
\`\`\`

**特殊情况（长度小于 2）**：

修复前：
\`\`\`json
{
  "values": [
    {"value": 0, "name": "Off"}
  ]
}
\`\`\`

修复后：
\`\`\`json
{
  "values": [
    {"value": 0, "name": "Off"},
    {"value": 0, "name": "Off"}
  ]
}
\`\`\`

---

### 4. ReferenceFixer

**执行时机**：第 4 位

**职责**：\`reference\` 父级 ID 扩展

**规则**：
- 如果 \`reference\` 中的某个 ID 是父级 ID（存在 \`父级ID.\` 开头的子级 ID）
- 则将该父级 ID 替换为所有子级 ID

**使用场景**：

当某个字段引用了一个父级对象（如 \`interface_settings\`），应该展开为所有子级字段的 ID。

**测试用例**：

**需要修复的情况**：

假设存在以下 ID：
- \`interface_settings.object\`
- \`interface_settings.baudrate\`
- \`interface_settings.port\`

修复前：
\`\`\`json
{
  "id": "device_config",
  "reference": ["interface_settings"]
}
\`\`\`

修复后：
\`\`\`json
{
  "id": "device_config",
  "reference": [
    "interface_settings.object",
    "interface_settings.baudrate",
    "interface_settings.port"
  ]
}
\`\`\`

**不需要修复的情况**：

如果 \`reference\` 中的 ID 不是父级（没有子级），则保持不变：

\`\`\`json
{
  "id": "device_config",
  "reference": ["temperature", "humidity"]
}
\`\`\`

修复后保持不变。

---

### 5. PropertyFixer

**执行时机**：第 5 位

**职责**：添加必需的基础属性

**IPSO 版本支持**：
- **IPSO v1**：不添加任何基础属性（返回空数组）
- **IPSO v2 或未指定**：添加完整的基础属性列表

**必需属性列表（仅 IPSO v2）**：
- \`tsl_version\`
- \`product_sn\`
- \`version.hardware_version\`
- \`version.firmware_version\`
- \`oem_id\`

**逻辑**：
1. 根据 IPSO 版本决定是否需要添加基础属性
2. 检查这些属性是否已存在于生成的对象列表中
3. 如果不存在，从 \`tslInfoMap\` 中查找
4. 使用 \`filterForCodec=false\` 强制生成（即使被标记为 \`showInToolbox=false\` 或 \`ignoreRow=1\`）
5. 添加到结果数组开头

**测试用例**：

修复前（假设缺少 \`tsl_version\`，IPSO v2）：
\`\`\`json
{
  "codec": [
    {"id": "temperature", "name": "Temperature", ...},
    {"id": "humidity", "name": "Humidity", ...}
  ]
}
\`\`\`

修复后：
\`\`\`json
{
  "codec": [
    {"id": "tsl_version", "name": "TSL Version", "data_type": "TEXT", ...},
    {"id": "temperature", "name": "Temperature", ...},
    {"id": "humidity", "name": "Humidity", ...}
  ]
}
\`\`\`

**注意事项**：
- 此 Fixer 依赖 \`context.tslInfoMap\`，如果没有提供则跳过
- 只添加缺失的属性，已存在的不会重复添加
- IPSO v1 不会添加任何基础属性

---

### 6. BlacklistWhitelistFixer

**执行时机**：第 6 位（最后执行）

**职责**：过滤掉不需要出现在 codec.json 中的属性

**ID 模式匹配**：

- **前缀匹配**：如 \`"cellular_settings."\` 会过滤所有以此开头的 ID
- **完全匹配**：如 \`"temp_sensor"\` 只过滤完全匹配的 ID
- **通配符匹配**：如 \`"*.test"\` 会过滤所有以 .test 结尾的 ID

**白名单优先**：

- 白名单中的 ID 不会被过滤，即使匹配黑名单规则
- 例如：黑名单包含 \`"lorawan_configuration_settings."\`，但白名单包含 \`"lorawan_configuration_settings.mode"\`，则 \`lorawan_configuration_settings.mode\` 不会被过滤

**默认黑名单**：

\`\`\`typescript
[
  'cellular_settings.',                  // 蜂窝配置
  'lorawan_configuration_settings.',     // LoRaWAN 配置
  'command_queries_reply.',              // 命令查询回复
  'request_command_queries.',            // 命令查询请求
  'full_inspection.',                    // 全检请求
  'full_inspection_reply.',              // 全检回复
]
\`\`\`

**默认白名单**：

\`\`\`typescript
[
  'lorawan_configuration_settings.mode', // 保留 LoRaWAN 模式配置
]
\`\`\`

## 附录

### 数据流转概览

\`\`\`
物模型维护表 (CSV)
    ↓
TSLInfoMap (解析后的原始数据)
    ↓
ThingSpec (标准化的中间格式)
    ↓
BacnetObject[] (使用 8 个 Builder)
    ↓
BacnetObject[] (使用 6 个 Fixer 修复)
    ↓
codec.json (最终输出)
\`\`\`
`,en=Object.assign({"../../../../src/codecJson/builders/access-mode-builder.ts":A,"../../../../src/codecJson/builders/data-type-builder.ts":C,"../../../../src/codecJson/builders/default-value-builder.ts":M,"../../../../src/codecJson/builders/max-length-builder.ts":w,"../../../../src/codecJson/builders/property-basic-builder.ts":V,"../../../../src/codecJson/builders/range-builder.ts":P,"../../../../src/codecJson/builders/reference-builder.ts":W,"../../../../src/codecJson/builders/unit-builder.ts":k,"../../../../src/codecJson/builders/values-builder.ts":G}),tn=Object.assign({"../../../../src/codecJson/fixes/base-fixer.ts":J,"../../../../src/codecJson/fixes/blacklist-whitelist-fixer.ts":$,"../../../../src/codecJson/fixes/index.ts":x,"../../../../src/codecJson/fixes/parameterless-service-fixer.ts":z,"../../../../src/codecJson/fixes/property-fixer.ts":Y,"../../../../src/codecJson/fixes/reference-fixer.ts":K,"../../../../src/codecJson/fixes/synchronize-time-fixer.ts":X,"../../../../src/codecJson/fixes/temperature-unit-fixer.ts":H,"../../../../src/codecJson/fixes/unit-fixer.ts":q,"../../../../src/codecJson/fixes/value-fixer.ts":Z,"../../../../src/codecJson/fixes/value-name-unit-symbol-fixer.ts":Q}),rn=["PropertyBasicBuilder","AccessModeBuilder","DefaultValueBuilder","DataTypeBuilder","UnitBuilder","MaxLengthBuilder","RangeBuilder","ValuesBuilder","ReferenceBuilder"],an=new Set(["base-fixer.ts","index.ts"]);function sn(e){return e.replace(/^\/\*\*\s*/,"").replace(/\s*\*\/$/,"").split(`
`).map(n=>n.replace(/^\s*\*\s?/,"").replace(/\s+$/,"")).join(`
`).trim()}function on(e){const n=e.match(/^\s*\/\*\*[\s\S]*?\*\//);return n?sn(n[0]):""}function y(e,n){const r=e.match(/export\s+(?:abstract\s+)?class\s+(\w+)/);return r!=null&&r[1]?r[1]:h(n).replace(/\.ts$/,"").split("-").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join("")}function cn(e){const n=new Map,r=/\.addFixer\(\s*new\s+(\w+)\s*\(/g;let t,a=1;for(;t=r.exec(e);)t[1]&&!n.has(t[1])&&(n.set(t[1],a),a+=1);return n}function ln(e){const r=e.indexOf("/src/");return r!==-1?e.slice(r+1):e.replace(/^(\.\.\/)+/,"")}function h(e){return e.split("/").pop()||e}function v(e){return e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase()}function un(e,n){for(const r of e.split(`
`)){const t=r.trim().match(/^#+\s+(.+)$/);if(t!=null&&t[1])return t[1].trim()}return n}function N(e){return e.split(`
`).map(r=>r.trim()).filter(Boolean).find(r=>!r.startsWith("#")&&!r.startsWith("-")&&!r.startsWith("|")&&!/^\d+\./.test(r))||"暂无规则注释"}function pn(e){const n=e.indexOf(`
## Builder 转换规则`);return(n===-1?e:e.slice(0,n)).replace(/\n## 目录[\s\S]*?\n---\n/,`
`).replace(/^#\s+CodecJson 字段转换规则文档\s*/u,`# 文档说明
`).replace(/^##\s+0\.\s+/mu,"## ").trim()}function O(e,n,r,t){const a=ln(n),s=y(e,a),o=on(e)||"暂无规则注释";return{id:`${r}-${v(s)}`,title:s,kind:r,sourcePath:a,markdown:o,summary:N(o),order:t}}function dn(){const e=pn(nn),n=un(e,"文档说明");return[{id:`overview-${v(n)}`,title:n,kind:"overview",sourcePath:"src/codecJson/docs/field-transformation-rules.md",markdown:e,summary:N(e),order:1}]}const fn=new Map(rn.map((e,n)=>[e,n+1])),mn=cn(x),_n=Object.entries(en).map(([e,n])=>{const r=y(n,e);return O(n,e,"builder",fn.get(r))}).sort((e,n)=>(e.order||Number.MAX_SAFE_INTEGER)-(n.order||Number.MAX_SAFE_INTEGER)||e.title.localeCompare(n.title)),Tn=Object.entries(tn).filter(([e])=>!an.has(h(e))).map(([e,n])=>{const r=y(n,e);return O(n,e,"fixer",mn.get(r))}).sort((e,n)=>(e.order||Number.MAX_SAFE_INTEGER)-(n.order||Number.MAX_SAFE_INTEGER)||e.title.localeCompare(n.title)),yn=[...dn(),..._n,...Tn],{Text:d,Title:T}=U,B={overview:"总览",builder:"Builder",fixer:"Fixer"},j={overview:"blue",builder:"green",fixer:"gold"},bn={overview:"生成总览",builder:"Builder 转换规则",fixer:"Fixer 修复规则"};function gn(e){const n=e.trim();return n===""||n.startsWith("```")||/^#{1,6}\s+/.test(n)||/^>\s+/.test(n)||/^[-*]\s+/.test(n)||/^\d+\.\s+/.test(n)||/^\|.+\|$/.test(n)}function p(e){const n=[],r=/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;let t=0,a;for(;a=r.exec(e);){a.index>t&&n.push(e.slice(t,a.index));const s=a[0];if(s.startsWith("`"))n.push(i.jsx("code",{children:s.slice(1,-1)},n.length));else if(s.startsWith("**"))n.push(i.jsx("strong",{children:s.slice(2,-2)},n.length));else{const o=s.match(/^\[([^\]]+)\]\(([^)]+)\)$/);o&&n.push(i.jsx("a",{href:o[2],target:o[2].startsWith("http")?"_blank":void 0,rel:o[2].startsWith("http")?"noreferrer":void 0,children:o[1]},n.length))}t=a.index+s.length}return t<e.length&&n.push(e.slice(t)),n}function In(e,n){return i.jsx("p",{children:e.map((r,t)=>i.jsxs(u.Fragment,{children:[t>0&&i.jsx("br",{}),p(r)]},`${n}-${t}`))},n)}function g(e,n,r){const t=n?"ol":"ul";return i.jsx(t,{children:e.map((a,s)=>{const o=a.match(/^(\s*)(?:[-*]|\d+\.)\s+(.+)$/),l=Math.floor(((o==null?void 0:o[1].length)||0)/2);return i.jsx("li",{style:{marginLeft:l*16},children:p((o==null?void 0:o[2])||a.trim())},`${r}-${s}`)})},r)}function xn(e,n){const r=e.filter((s,o)=>o!==1||!/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(s)).map(s=>s.trim().replace(/^\||\|$/g,"").split("|").map(o=>o.trim())),[t,...a]=r;return i.jsx("div",{className:"codec-doc-table-wrap",children:i.jsxs("table",{children:[t&&i.jsx("thead",{children:i.jsx("tr",{children:t.map((s,o)=>i.jsx("th",{children:p(s)},o))})}),i.jsx("tbody",{children:a.map((s,o)=>i.jsx("tr",{children:s.map((l,c)=>i.jsx("td",{children:p(l)},c))},o))})]})},n)}function hn(e,n){return i.jsx("blockquote",{children:e.map((r,t)=>i.jsxs(u.Fragment,{children:[t>0&&i.jsx("br",{}),p(r.replace(/^>\s?/,"").trim())]},`${n}-${t}`))},n)}function vn(e,n,r){const t=p(n);switch(e){case 1:return i.jsx("h1",{children:t},r);case 2:return i.jsx("h2",{children:t},r);case 3:return i.jsx("h3",{children:t},r);default:return i.jsx("h4",{children:t},r)}}function Nn({markdown:e}){const n=[],r=e.split(`
`);let t=0;for(;t<r.length;){const a=r[t],s=a.trim();if(!s){t+=1;continue}if(s.startsWith("```")){const c=s.slice(3).trim(),b=[];for(t+=1;t<r.length&&!r[t].trim().startsWith("```");)b.push(r[t]),t+=1;t+=1,n.push(i.jsxs("pre",{children:[c&&i.jsx("span",{className:"codec-doc-code-lang",children:c}),i.jsx("code",{children:b.join(`
`)})]},n.length));continue}const o=s.match(/^(#{1,6})\s+(.+)$/);if(o){const c=Math.min(o[1].length,4);n.push(vn(c,o[2],n.length)),t+=1;continue}if(/^>\s+/.test(s)){const c=[];for(;t<r.length&&/^>\s+/.test(r[t].trim());)c.push(r[t].trim()),t+=1;n.push(hn(c,n.length));continue}if(/^\|.+\|$/.test(s)){const c=[];for(;t<r.length&&/^\|.+\|$/.test(r[t].trim());)c.push(r[t]),t+=1;n.push(xn(c,n.length));continue}if(/^\s*[-*]\s+/.test(a)){const c=[];for(;t<r.length&&/^\s*[-*]\s+/.test(r[t]);)c.push(r[t]),t+=1;n.push(g(c,!1,n.length));continue}if(/^\s*\d+\.\s+/.test(a)){const c=[];for(;t<r.length&&/^\s*\d+\.\s+/.test(r[t]);)c.push(r[t]),t+=1;n.push(g(c,!0,n.length));continue}const l=[];for(;t<r.length&&!gn(r[t]);)l.push(r[t].trim()),t+=1;n.push(In(l,n.length))}return i.jsx("div",{className:"codec-doc-markdown",children:n})}function On(e){var n;(n=document.getElementById(e))==null||n.scrollIntoView({behavior:"smooth",block:"start"})}function Bn({doc:e}){const n=e.markdown.trim().startsWith("# ");return i.jsxs("article",{id:e.id,className:"codec-rule-article",children:[i.jsx("header",{className:"codec-rule-article-head",children:i.jsxs("div",{children:[i.jsxs(I,{size:8,wrap:!0,children:[!n&&i.jsx(T,{level:3,children:e.title}),i.jsx(f,{color:j[e.kind],children:B[e.kind]}),e.order!=null&&i.jsxs(f,{children:["#",e.order]}),n&&i.jsx(d,{type:"secondary",children:e.sourcePath})]}),!n&&i.jsx(d,{type:"secondary",children:e.sourcePath})]})}),i.jsx(Nn,{markdown:e.markdown})]})}function Sn(){const[e,n]=u.useState(""),r=u.useMemo(()=>{const a=e.trim().toLowerCase();return yn.filter(s=>a?[s.title,s.summary,s.sourcePath,s.markdown].join(`
`).toLowerCase().includes(a):!0)},[e]),t=["overview","builder","fixer"].map(a=>({kind:a,title:bn[a],docs:r.filter(s=>s.kind===a)})).filter(a=>a.docs.length>0);return i.jsxs("div",{className:"codec-rules-page",children:[i.jsxs("aside",{className:"codec-rules-sidebar",children:[i.jsxs("div",{className:"codec-rules-sidebar-head",children:[i.jsxs(I,{size:8,children:[i.jsx(E,{}),i.jsx(d,{strong:!0,children:"Codec 规则"})]}),i.jsxs(d,{type:"secondary",children:[r.length," 项"]})]}),i.jsx(L,{allowClear:!0,prefix:i.jsx(S,{}),placeholder:"搜索规则",value:e,onChange:a=>n(a.target.value)}),i.jsx("nav",{className:"codec-rules-toc",children:t.length===0?i.jsx(m,{image:m.PRESENTED_IMAGE_SIMPLE,description:"没有匹配内容"}):t.map(a=>i.jsxs("div",{className:"codec-rules-toc-group",children:[i.jsx("div",{className:"codec-rules-toc-group-title",children:a.title}),a.docs.map(s=>i.jsxs("button",{type:"button",onClick:()=>On(s.id),className:"codec-rules-toc-item",children:[i.jsx("span",{children:s.title}),i.jsx(f,{color:j[s.kind],children:B[s.kind]})]},s.id))]},a.kind))})]}),i.jsxs("main",{className:"codec-rules-content",children:[i.jsx("section",{className:"codec-rules-intro",children:i.jsxs("div",{children:[i.jsx(T,{level:2,children:"Codec 规则文档"}),i.jsx(d,{type:"secondary",children:"从 codec.json 生成链路源码注释自动生成，适合测试和业务同学快速确认字段转换规则。"})]})}),t.length===0?i.jsx("div",{className:"codec-rules-empty",children:i.jsx(m,{description:"没有匹配内容"})}):t.map(a=>i.jsxs("section",{className:"codec-rules-section",children:[i.jsxs("div",{className:"codec-rules-section-title",children:[i.jsx(T,{level:3,children:a.title}),i.jsx(f,{children:a.docs.length})]}),a.docs.map(s=>i.jsx(Bn,{doc:s},s.id))]},a.kind))]})]})}export{Sn as default};
