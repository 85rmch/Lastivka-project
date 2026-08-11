import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Truck, CheckCircle2, ArrowRight, Bell } from 'lucide-react';
import { CartItem, Order } from '../types';
import { getCleanImage } from '../data';
import { motion } from 'motion/react';
import { maybeTranslate } from '../lib/translator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (idx: number, qty: number) => void;
  onRemoveItem: (idx: number) => void;
  onPlaceOrder: (order: Omit<Order, 'date' | 'status'>) => void;
  lang: 'ru' | 'ua';
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  lang
}: CartDrawerProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('np'); // 'np' | 'up' | 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isTgDetected, setIsTgDetected] = useState(false);
  const [botUsername, setBotUsername] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      try {
        const tgWebApp = (window as any).Telegram?.WebApp;
        if (tgWebApp) {
          tgWebApp.ready();
          const tgUser = tgWebApp.initDataUnsafe?.user;
          if (tgUser) {
            if (tgUser.id) {
              setTelegram(String(tgUser.id));
              setIsTgDetected(true);
            }
            if (tgUser.first_name && !name) {
              const fullName = tgUser.last_name 
                ? `${tgUser.first_name} ${tgUser.last_name}` 
                : tgUser.first_name;
              setName(fullName);
            }
          }
        }
      } catch (err) {
        console.error('Error reading Telegram WebApp initData:', err);
      }
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (orderCompleted && !isTgDetected) {
      fetch('/api/telegram/bot-info')
        .then(res => res.json())
        .then(data => {
          if (data && data.username) {
            setBotUsername(data.username);
          }
        })
        .catch(err => console.error('Error fetching bot info:', err));
    }
  }, [orderCompleted, isTgDetected]);

  if (!isOpen) return null;

  const t = {
    ru: {
      title: 'Ваша корзина',
      empty: 'Ваша корзина пуста',
      emptyDesc: 'Добавьте понравившиеся товары из каталога, чтобы сделать заказ.',
      qty: 'Кол-во',
      checkoutTitle: 'Оформление заказа',
      nameLabel: 'Имя и фамилия получателя',
      namePlh: 'Иван Иванов',
      phoneLabel: 'Номер телефона',
      phonePlh: '+380 XX XXX XX XX',
      telegramLabel: 'Telegram Chat ID (необязательно, для уведомлений)',
      telegramPlh: 'Например, 12345678',
      telegramHelp: 'Отправьте /start боту @getmyid_bot, чтобы узнать ваш ID',
      telegramDetected: '✓ ID определен автоматически из Telegram Web App!',
      deliveryLabel: 'Способ доставки',
      methods: {
        np: 'Новая Почта (в отделение)',
        up: 'Укрпочта',
        pickup: 'Самовывоз (Кривой Рог)'
      },
      addressLabel: 'Адрес доставки / Номер отделения',
      addressPlh: 'г. Киев, отделение №15',
      summary: 'Ваш заказ',
      subtotal: 'Сумма товаров',
      shipping: 'Доставка',
      shippingFree: 'Бесплатно',
      shippingCost: '80 ₴',
      shippingFreeCondition: 'При заказе от 1 500 ₴ доставка бесплатна!',
      total: 'Итого к оплате',
      orderBtn: 'Подтвердить заказ',
      successTitle: 'Заказ успешно оформлен!',
      successDesc: 'Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время по указанному телефону для подтверждения деталей.',
      orderNum: 'Номер вашего заказа',
      continueBtn: 'Продолжить покупки',
      tgNotifyTitle: 'Уведомления в Telegram',
      tgNotifyDesc: 'Хотите получать мгновенные сообщения об изменении статуса вашего заказа?',
      tgNotifyBtn: 'Подключить уведомления в Telegram'
    },
    ua: {
      title: 'Ваш кошик',
      empty: 'Ваш кошик порожній',
      emptyDesc: 'Додайте вподобані товари з каталогу, щоб зробити замовлення.',
      qty: 'К-сть',
      checkoutTitle: 'Оформлення замовлення',
      nameLabel: 'Ім\'я та прізвище отримувача',
      namePlh: 'Іван Іванов',
      phoneLabel: 'Номер телефону',
      phonePlh: '+380 XX XXX XX XX',
      telegramLabel: 'Telegram Chat ID (необов\'язково, для сповіщень)',
      telegramPlh: 'Наприклад, 12345678',
      telegramHelp: 'Надішліть /start боту @getmyid_bot, щоб дізнатися ваш ID',
      telegramDetected: '✓ ID визначено автоматично з Telegram Web App!',
      deliveryLabel: 'Спосіб доставки',
      methods: {
        np: 'Нова Пошта (у відділення)',
        up: 'Укрпошта',
        pickup: 'Самовивіз (Кривий Ріг)'
      },
      addressLabel: 'Адреса доставки / Номер відділення',
      addressPlh: 'м. Київ, відділення №15',
      summary: 'Ваше замовлення',
      subtotal: 'Сума товарів',
      shipping: 'Доставка',
      shippingFree: 'Безкоштовно',
      shippingCost: '80 ₴',
      shippingFreeCondition: 'При замовленні від 1 500 ₴ доставка безкоштовна!',
      total: 'Всього до сплати',
      orderBtn: 'Підтвердити замовлення',
      successTitle: 'Замовлення успішно оформлено!',
      successDesc: 'Дякуємо за замовлення! Наш менеджер зв\'яжеться з вами найближчим часом за вказаним телефоном для підтвердження деталей.',
      orderNum: 'Номер вашого замовлення',
      continueBtn: 'Продовжити покупки',
      tgNotifyTitle: 'Сповіщення в Telegram',
      tgNotifyDesc: 'Хочете отримувати миттєві повідомлення про зміну статусу вашого замовлення?',
      tgNotifyBtn: 'Підключити сповіщення в Telegram'
    }
  }[lang];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingCost = (deliveryMethod === 'pickup' || subtotal >= 1500) ? 0 : 80;
  const total = subtotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (deliveryMethod !== 'pickup' && !deliveryAddress)) return;

    const orderId = 'LST-' + Math.floor(100000 + Math.random() * 900000);
    
    const deliveryStr = deliveryMethod === 'pickup'
      ? (lang === 'ru' ? 'Самовывоз (Кривой Рог)' : 'Самовивіз (Кривий Ріг)')
      : `${deliveryMethod === 'np' ? 'Нова Пошта' : 'Укрпошта'} - ${deliveryAddress}`;

    onPlaceOrder({
      id: orderId,
      customerInfo: { name, phone, delivery: deliveryStr, telegram },
      items: cartItems,
      total
    });

    setPlacedOrderId(orderId);
    setOrderCompleted(true);
    setName('');
    setPhone('');
    setTelegram('');
    setDeliveryAddress('');
  };

  const handleClose = () => {
    setOrderCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      {/* Tap off-target to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="relative w-full max-w-md bg-white border-l border-gray-200 h-full shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50 text-gray-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e02484]" />
            <h3 className="text-lg font-bold tracking-tight font-sans">{t.title}</h3>
            {cartItems.length > 0 && !orderCompleted && (
              <span className="bg-[#e02484] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {orderCompleted ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-5 overflow-y-auto bg-white text-gray-800">
            <div className="w-16 h-16 bg-pink-50 text-[#e02484] border border-pink-200 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-gray-900">{t.successTitle}</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">{t.successDesc}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 w-full font-mono text-xs">
              <p className="text-gray-400 uppercase tracking-wider">{t.orderNum}</p>
              <p className="text-lg font-bold text-[#e02484] mt-1">{placedOrderId}</p>
            </div>

            {!isTgDetected && botUsername && (
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl w-full text-center space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-indigo-700">
                  <Bell className="w-4 h-4 text-indigo-600 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-wider">{t.tgNotifyTitle}</p>
                </div>
                <p className="text-[11px] text-gray-600 leading-normal">
                  {t.tgNotifyDesc}
                </p>
                <a
                  href={`https://t.me/${botUsername}?start=${placedOrderId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {t.tgNotifyBtn}
                </a>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#e02484] hover:bg-[#c0146f] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {t.continueBtn}
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{t.empty}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed font-sans">{t.emptyDesc}</p>
            </div>
          </div>
        ) : (
          /* Cart items and checkout form */
          <div className="flex-1 overflow-y-auto flex flex-col bg-white">
            
            {/* List of Cart Items */}
            <div className="p-5 space-y-4 border-b border-gray-200 divide-y divide-gray-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-4 first:pt-0">
                  {/* Photo thumbnail */}
                  <div 
                    className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-200 cursor-pointer"
                    onClick={() => setZoomedImage(getCleanImage(item.product, 0))}
                  >
                    <img
                      src={getCleanImage(item.product, 0)}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 hover:text-[#e02484] truncate leading-snug">
                      {maybeTranslate(item.product.name, lang)}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {item.product.product_code} {item.selectedSize !== 'Unisex' && `| ${item.selectedSize}`} {item.selectedColor !== 'Default' && `| ${maybeTranslate(item.selectedColor, lang)}`}
                    </p>
                    
                    {/* Price and controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-900">
                          {(item.product.price * item.quantity).toLocaleString('uk-UA')} грн
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmitOrder} className="p-5 shrink-0 space-y-4 bg-gray-50 text-gray-800 border-t border-gray-200">
              

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t.nameLabel} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.namePlh}
                  className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#e02484] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t.phoneLabel} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => {
                    const val = e.target.value;
                    if (/^\+?\d{0,12}$/.test(val)) {
                      setPhone(val);
                    }
                  }}
                  placeholder={t.phonePlh}
                  className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#e02484] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t.telegramLabel}</label>
                <input
                  type="text"
                  value={telegram}
                  onChange={e => {
                    setTelegram(e.target.value);
                    if (isTgDetected) setIsTgDetected(false);
                  }}
                  placeholder={t.telegramPlh}
                  className={`w-full p-2.5 bg-white border ${isTgDetected ? 'border-green-400 focus:ring-green-400' : 'border-gray-300 focus:ring-[#e02484]'} text-gray-900 placeholder-gray-400 rounded-lg text-xs focus:outline-none focus:ring-1 transition-all font-mono`}
                />
                {isTgDetected ? (
                  <p className="text-[10px] text-green-600 font-semibold mt-1">{t.telegramDetected}</p>
                ) : (
                  <p className="text-[10px] text-gray-400 mt-1">{t.telegramHelp}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.deliveryLabel} *</label>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'np', icon: Truck },
                    { id: 'up', icon: Truck },
                    { id: 'pickup', icon: CheckCircle2 }
                  ].map(m => (
                    <label 
                      key={m.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        deliveryMethod === m.id 
                          ? 'border-[#e02484] bg-pink-50 font-semibold text-gray-900' 
                          : 'border-gray-300 bg-white text-gray-600 hover:border-[#e02484]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={m.id}
                        checked={deliveryMethod === m.id}
                        onChange={() => setDeliveryMethod(m.id)}
                        className="accent-[#e02484]"
                      />
                      <span>{t.methods[m.id as 'np' | 'up' | 'pickup']}</span>
                    </label>
                  ))}
                </div>
              </div>

              {deliveryMethod !== 'pickup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{t.addressLabel} *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder={t.addressPlh}
                    className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#e02484] transition-all"
                  />
                </div>
              )}

              {/* Order total summary */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.subtotal}</span>
                  <span className="font-bold text-gray-900">{subtotal.toLocaleString('uk-UA')} грн</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.shipping}</span>
                  <span className="font-bold text-gray-900">
                    {shippingCost === 0 ? t.shippingFree : t.shippingCost}
                  </span>
                </div>
                {deliveryMethod !== 'pickup' && subtotal < 1500 && (
                  <p className="text-[10px] text-[#e02484] font-sans leading-tight pt-1">
                    {t.shippingFreeCondition}
                  </p>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold text-gray-900">
                  <span>{t.total}</span>
                  <span>{total.toLocaleString('uk-UA')} грн</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#e02484] hover:bg-[#c0146f] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-4 active:scale-98 cursor-pointer"
              >
                <span>{t.orderBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </form>
          </div>
        )}

      </motion.div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomedImage(null);
            }}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed product" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

