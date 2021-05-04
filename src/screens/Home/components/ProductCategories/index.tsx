import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'redux-store';
import CategoryItem from 'components/items/CategoryItem';

interface ProductCategoriesProps {
  style?: ViewStyle;
}

const itemGutter = 3;

const ProductCategories = ({ style }: ProductCategoriesProps) => {
  const navigation = useNavigation();
  const categories = useSelector(state => state.product?.categories);

  const onPress = (id: string) => () => {
    navigation.navigate('GoToMarket', { activeID: id });
  };

  return (
    <View style={style}>
      <View style={styles.producPortfolio}>
        {categories.map((item: any) => (
          <CategoryItem
            key={`category-${item.id}`}
            label={item.category_name}
            thumbnail={item.thumbnail}
            onPress={onPress(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  producPortfolio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginHorizontal: -itemGutter,
  },
});

export default ProductCategories;
