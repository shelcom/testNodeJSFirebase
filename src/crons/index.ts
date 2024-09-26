import cron from 'node-cron';
import PurchaseService from 'services/purchaseService';
import {container} from 'tsyringe';

// runs each hour
cron.schedule('0 0 */1 * * *', () => {
  const purchaseServiceInstance = container.resolve(PurchaseService);
  purchaseServiceInstance.checkSubscriptions();
});
