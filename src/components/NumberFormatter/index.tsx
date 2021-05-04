import React from 'react';
import Formatter from 'react-number-format';
import Text, { TextProps } from '../Text';

interface NumberFormatterProps extends TextProps {
  prefix?: string;
  suffix?: string;
  value: any;
}

const NumberFormatter = ({ prefix, suffix = 'đ', value, ...others }: NumberFormatterProps) => (
  <Formatter
    thousandSeparator=","
    prefix={prefix}
    suffix={suffix}
    displayType="text"
    renderText={(v: any) => <Text {...others}>{v}</Text>}
    value={value}
  />
);

export default NumberFormatter;
