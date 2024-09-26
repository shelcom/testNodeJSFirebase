import {Dish} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

export type DishWithOwnerId = Dish & {owner_id: number};

@injectable()
export default class DishRepository extends BaseRepository<Dish> {
  constructor() {
    super(Dish);
  }

  getPrices = async (ids: number[]) => {
    const prices = await Dish.query().select('price').whereIn('id', ids);
    return prices;
  };

  joinRestaurantsToGetOwnerId = async (id: number) => {
    const dishes = await this.join({
      joinParams: {
        table: 'Restaurants',
        joinedColumn: 'Restaurants.id',
        column: 'restaurant_id',
      },
      selectParams: ['Dishes.*', 'Restaurants.owner_id'],
      whereParams: {
        'Dishes.id': id,
      },
    });

    if (dishes.length > 0) {
      return dishes[0] as DishWithOwnerId;
    }

    return null;
  };
}
