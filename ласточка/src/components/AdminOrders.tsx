import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
    Check, 
    X, 
    Clock, 
    Loader2, 
    Package, 
    Truck, 
    AlertCircle, 
    Inbox, 
    ChevronDown, 
    ChevronUp, 
    User, 
    Phone, 
    MapPin, 
    DollarSign,
    CornerUpLeft,
    Calendar,
    BarChart3,
    Printer,
    Download,
    FileSpreadsheet
} from 'lucide-react';

import { getAuthClient, getStoredConfig } from '../lib/supabase';

export default function AdminOrders({ adminPassword, lang = 'ua' }: { adminPassword: string; lang?: 'ru' | 'ua' }) {
    const t = {
        ru: {
            title: 'Управление заказами',
            subTitle: 'Переключайте вкладки и меняйте статусы для автоматического перемещения заказов',
            statsBtn: 'История и статистика',
            refreshBtn: 'Обновить список',
            emptyTitle: 'Здесь пусто',
            emptyDesc: 'Нет заказов в этой категории',
            orderNum: 'Заказ #',
            noName: 'Без имени',
            noPhone: 'Без телефона',
            totalSum: 'Сумма:',
            totalUnit: 'грн',
            statusLabel: 'Статус:',
            itemsCount: 'Состав заказа ({count} поз.)',
            itemSize: 'Размер:',
            itemColor: 'Цвет:',
            itemQty: 'кол-во:',
            btnToWork: 'В работу',
            btnReject: 'Отклонить',
            btnAssemble: 'Собрать',
            btnShip: 'Отправить',
            btnBackToNew: 'Вернуть в новые',
            btnRestoreToNew: 'Восстановить в новые',
            promptRejectTitle: 'Укажите причину отклонения',
            promptShipTitle: 'Укажите ТТН (номер накладной)',
            promptTelegramNotice: 'Информация будет отправлена в сообщении клиенту в Telegram',
            promptRejectPlaceholder: 'Причина отклонения...',
            promptShipPlaceholder: 'Номер ТТН...',
            cancel: 'Отмена',
            confirm: 'Подтвердить',
            historyTitle: 'История отправленных заказов',
            historySub: 'Статистика и выборка за указанный период',
            dateFrom: 'Дата с',
            dateTo: 'Дата по',
            statShipped: 'Отправлено',
            statSum: 'Сумма',
            statAvg: 'Средний чек',
            exportLabel: 'Экспорт:',
            printBtn: 'Печать',
            csvBtn: 'CSV (Excel)',
            jsonBtn: 'JSON',
            printTitle: 'Отчет по отправленным заказам',
            printPeriod: 'Период: с {start} по {end}',
            printTableId: 'ID Заказа',
            printTableDate: 'Дата создания',
            printTableClient: 'Клиент',
            printTablePhone: 'Телефон',
            printTableDelivery: 'Адрес / Доставка',
            printTableItems: 'Состав заказа',
            printTableSum: 'Сумма',
            printFooter: 'Отчет сгенерирован автоматически из панели администратора: {date}',
            historyHeader: 'Выборка заказов ({count})',
            historyEmpty: 'Нет отправленных заказов за этот период',
            historyItems: 'Состав ({count})',
            close: 'Закрыть',
            printTitleShort: 'Отчет по отправленным заказам за период: {start} - {end}',
            tooltipZoom: 'Нажмите для увеличения',
            tooltipPrint: 'Распечатать отчет и список заказов',
            tooltipCsv: 'Скачать в формате CSV для Excel, Google Таблиц и др.',
            tooltipJson: 'Скачать в формате JSON',
            contactTelegram: 'Написать в TG'
        },
        ua: {
            title: 'Керування замовленнями',
            subTitle: 'Перемикайте вкладки та змінюйте статуси для автоматичного переміщення замовлень',
            statsBtn: 'Історія та статистика',
            refreshBtn: 'Оновити список',
            emptyTitle: 'Тут порожньо',
            emptyDesc: 'Немає замовлень у цій категорії',
            orderNum: 'Замовлення #',
            noName: 'Без імені',
            noPhone: 'Без телефону',
            totalSum: 'Сума:',
            totalUnit: 'грн',
            statusLabel: 'Статус:',
            itemsCount: 'Склад замовлення ({count} поз.)',
            itemSize: 'Розмір:',
            itemColor: 'Колір:',
            itemQty: 'к-сть:',
            btnToWork: 'В роботу',
            btnReject: 'Відхилити',
            btnAssemble: 'Зібрати',
            btnShip: 'Надіслати',
            btnBackToNew: 'Повернути в нові',
            btnRestoreToNew: 'Відновити в нові',
            promptRejectTitle: 'Вкажіть причину відхилення',
            promptShipTitle: 'Вкажіть ТТН (номер накладної)',
            promptTelegramNotice: 'Інформація буде надіслана у повідомленні клієнту в Telegram',
            promptRejectPlaceholder: 'Причина відхилення...',
            promptShipPlaceholder: 'Номер ТТН...',
            cancel: 'Скасувати',
            confirm: 'Підтвердити',
            historyTitle: 'Історія відправлених замовлень',
            historySub: 'Статистика та вибірка за вказаний період',
            dateFrom: 'Дата з',
            dateTo: 'Дата по',
            statShipped: 'Відправлено',
            statSum: 'Сума',
            statAvg: 'Середній чек',
            exportLabel: 'Експорт:',
            printBtn: 'Друк',
            csvBtn: 'CSV (Excel)',
            jsonBtn: 'JSON',
            printTitle: 'Звіт по відправлених замовленнях',
            printPeriod: 'Період: з {start} по {end}',
            printTableId: 'ID Замовлення',
            printTableDate: 'Дата створення',
            printTableClient: 'Клієнт',
            printTablePhone: 'Телефон',
            printTableDelivery: 'Адреса / Доставка',
            printTableItems: 'Склад замовлення',
            printTableSum: 'Сума',
            printFooter: 'Звіт згенеровано автоматично з панелі адміністратора: {date}',
            historyHeader: 'Вибірка замовлень ({count})',
            historyEmpty: 'Немає відправлених замовлень за цей період',
            historyItems: 'Склад ({count})',
            close: 'Закрити',
            printTitleShort: 'Звіт по відправлених замовленнях за період: {start} - {end}',
            tooltipZoom: 'Натисніть для збільшення',
            tooltipPrint: 'Роздрукувати звіт та список замовлень',
            tooltipCsv: 'Завантажити у форматі CSV для Excel, Google Таблиць тощо.',
            tooltipJson: 'Завантажити у форматі JSON',
            contactTelegram: 'Написати в TG'
        }
    }[lang];

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'new' | 'processing' | 'assembled' | 'shipped' | 'rejected'>('new');
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
    const [promptState, setPromptState] = useState<{
        orderId: string;
        statusType: 'отклонен' | 'отправлен на почту';
        value: string;
    } | null>(null);
    const [confirmState, setConfirmState] = useState<{
        orderId: string;
        statusType: string;
        title: string;
        message: string;
    } | null>(null);

    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(1); // First day of current month
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const getToken = async () => {
        try {
            const authClient = getAuthClient();
            if (authClient) {
                const { data: { session } } = await authClient.auth.getSession();
                if (session) return session.access_token;
            }
        } catch(e) {}
        return '';
    };

    const fetchOrders = async () => {
        setLoading(true);
        const token = await getToken();
        const config = getStoredConfig();
        const res = await fetch('/api/orders/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminPassword,
                token,
                supabaseConfig: {
                    url: config.url,
                    anonKey: config.anonKey || config.secretKey,
                    tableName: config.tableName
                }
            })
        });
        const { data, error } = await res.json();
        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [adminPassword]);

    const executeUpdateStatus = async (orderId: string, finalStatus: string) => {
        const token = await getToken();
        const config = getStoredConfig();
        const res = await fetch('/api/orders/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId,
                status: finalStatus,
                adminPassword,
                token,
                supabaseConfig: {
                    url: config.url,
                    anonKey: config.anonKey || config.secretKey,
                    tableName: config.tableName
                }
            })
        });
        if (res.ok) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: finalStatus } : o));
        } else {
            console.error('Failed to update status');
        }
    };

    const handleConfirmStatusChange = async () => {
        if (confirmState) {
            const { orderId, statusType } = confirmState;
            setConfirmState(null);
            await executeUpdateStatus(orderId, statusType);
        }
    };

    const updateStatus = async (orderId: string, statusType: string) => {
        if (statusType === 'отклонен') {
            setPromptState({ orderId, statusType: 'отклонен', value: '' });
        } else if (statusType === 'отправлен на почту') {
            setPromptState({ orderId, statusType: 'отправлен на почту', value: '' });
        } else {
            const orderShortId = String(orderId || '').slice(0, 8);
            let statusLabel = statusType;
            if (statusType === 'в работе') statusLabel = lang === 'ru' ? 'В работе' : 'В роботі';
            if (statusType === 'собран') statusLabel = lang === 'ru' ? 'Собран' : 'Зібраний';
            if (statusType === 'pending') statusLabel = lang === 'ru' ? 'Новые' : 'Нові';

            setConfirmState({
                orderId,
                statusType,
                title: lang === 'ru' ? 'Подтверждение смены статуса' : 'Підтвердження зміни статусу',
                message: lang === 'ru' 
                    ? `Вы действительно хотите перевести заказ #${orderShortId} в статус "${statusLabel}"?`
                    : `Ви дійсно хочете перевести замовлення #${orderShortId} в статус "${statusLabel}"?`
            });
        }
    };

    const getOrderTab = (status: string): 'new' | 'processing' | 'assembled' | 'shipped' | 'rejected' => {
        const s = String(status || '').toLowerCase();
        if (s.startsWith('в работе') || s === 'processing') return 'processing';
        if (s === 'собран') return 'assembled';
        if (s.startsWith('отправлен') || s === 'shipped') return 'shipped';
        if (s.startsWith('отклонен')) return 'rejected';
        return 'new';
    };

    const getCleanImage = (product: any, index: number = 0) => {
        if (!product) return '';
        let photoVal = product.photo;
        
        // If it's a string, try to parse it as JSON or split by comma
        if (typeof photoVal === 'string') {
            photoVal = photoVal.trim();
            if (photoVal.startsWith('[') && photoVal.endsWith(']')) {
                try {
                    photoVal = JSON.parse(photoVal);
                } catch (e) {
                    photoVal = photoVal.replace(/[\[\]"']/g, '').split(',').map((s: string) => s.trim());
                }
            } else if (photoVal.includes(',')) {
                photoVal = photoVal.split(',').map((s: string) => s.trim());
            } else {
                photoVal = [photoVal];
            }
        }
        
        if (!Array.isArray(photoVal)) {
            photoVal = photoVal ? [photoVal] : [];
        }

        // Get the requested index or first item
        let src = photoVal[index] || photoVal[0] || '';
        if (!src || typeof src !== 'string') return '';

        // Clean the image URL exactly like cleanImageUrl
        let cleaned = src.trim().replace(/^["'\\\[\s]+|["'\\\]\s]+$/g, '').trim();
        cleaned = cleaned
            .replace(/\/(1-sets|1 - sets|1%20-%20sets)\//g, '/1%20-%20sets/')
            .replace(/\/(2-bras_bralets|2 - bras_bralets|2%20-%20bras_bralets)\//g, '/2%20-%20bras_bralets/')
            .replace(/\/(3-panties|3 - panties|3%20-%20panties)\//g, '/3%20-%20panties/')
            .replace(/\/(4-pajamas|4 - pajamas|4%20-%20pajamas)\//g, '/4%20-%20pajamas/')
            .replace(/\/(5-swim|5 - swim|5%20-%20swim)\//g, '/5%20-%20swim/')
            .replace(/\/(6-erotic|6 - erotic|6%20-%20erotic)\//g, '/6%20-%20erotic/')
            .replace(/\/(8-shubki|8 - shubki|8%20-%20shubki)\//g, '/8%20-%20shubki/')
            .replace(/\/(9-lingerie|9 - lingerie|9%20-%20lingerie)\//g, '/9%20-%20lingerie/')
            .replace(/\/(10-chulki|10 - chulki|10%20-%20chulki)\//g, '/10%20-%20chulki/');

        return cleaned;
    };

    const getTelegramContact = (order: any) => {
        if (!order) return null;
        let tgInfo = '';
        const deliveryInfoStr = order.delivery_info != null ? String(order.delivery_info) : '';
        if (deliveryInfoStr) {
            const match = deliveryInfoStr.match(/TG Chat ID:\s*(.+)$/i);
            if (match) {
                tgInfo = match[1].trim();
            }
        }
        
        // If they provided a non-numeric Telegram handle (like @username or username)
        if (tgInfo && isNaN(Number(tgInfo.startsWith('@') ? tgInfo.slice(1) : tgInfo))) {
            const cleanTg = tgInfo.startsWith('@') ? tgInfo.slice(1) : tgInfo;
            return {
                url: `tg://resolve?domain=${cleanTg}`,
                label: tgInfo,
                type: 'username' as const
            };
        }
        
        // If they didn't provide a username, but have a phone number, we normalize and use tg://resolve?phone=
        const phoneStr = order.customer_phone != null ? String(order.customer_phone).trim() : '';
        if (phoneStr) {
            const cleanPhone = phoneStr.replace(/\D/g, '');
            let formattedPhone = cleanPhone;
            
            if (cleanPhone.startsWith('380') && cleanPhone.length === 12) {
                formattedPhone = cleanPhone;
            } else if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
                formattedPhone = '38' + cleanPhone;
            } else if (cleanPhone.startsWith('80') && cleanPhone.length === 11) {
                formattedPhone = '3' + cleanPhone;
            } else if (cleanPhone.length === 9) {
                formattedPhone = '380' + cleanPhone;
            } else if (cleanPhone.length === 10) {
                // If it is a 10 digit number starting with standard codes, prepend 38
                if (/^(50|66|95|99|67|68|96|97|98|63|73|93|89|91|92|94)\d{8}$/.test(cleanPhone)) {
                    formattedPhone = '38' + cleanPhone;
                }
            }
            
            return {
                url: `tg://resolve?phone=${formattedPhone}`,
                label: phoneStr,
                type: 'phone' as const
            };
        }
        
        // As a last resort, if there is a numeric Chat ID and no phone, use tg:// user link
        if (tgInfo) {
            const cleanTg = tgInfo.startsWith('@') ? tgInfo.slice(1) : tgInfo;
            return {
                url: `tg://user?id=${cleanTg}`,
                label: `@id${tgInfo}`,
                type: 'id' as const
            };
        }
        
        return null;
    };

    const toggleOrderExpanded = (orderId: string) => {
        setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-[#e02484]" /></div>;

    // Categorize and count orders
    const counts = {
        new: orders.filter(o => getOrderTab(o.status) === 'new').length,
        processing: orders.filter(o => getOrderTab(o.status) === 'processing').length,
        assembled: orders.filter(o => getOrderTab(o.status) === 'assembled').length,
        shipped: orders.filter(o => getOrderTab(o.status) === 'shipped').length,
        rejected: orders.filter(o => getOrderTab(o.status) === 'rejected').length,
    };

    const filteredOrders = orders.filter(o => getOrderTab(o.status) === activeTab);

    const tabsList = [
        { id: 'new', label: lang === 'ru' ? 'Новые' : 'Нові', count: counts.new, color: 'bg-pink-100 text-[#e02484]', activeClass: 'border-[#e02484] text-[#e02484] bg-white shadow-sm' },
        { id: 'processing', label: lang === 'ru' ? 'В работе' : 'В роботі', count: counts.processing, color: 'bg-yellow-100 text-yellow-800', activeClass: 'border-yellow-500 text-yellow-800 bg-white shadow-sm' },
        { id: 'assembled', label: lang === 'ru' ? 'Собранные' : 'Зібрані', count: counts.assembled, color: 'bg-blue-100 text-blue-800', activeClass: 'border-blue-500 text-blue-800 bg-white shadow-sm' },
        { id: 'shipped', label: lang === 'ru' ? 'Отправленные' : 'Відправлені', count: counts.shipped, color: 'bg-green-100 text-green-800', activeClass: 'border-green-500 text-green-800 bg-white shadow-sm' },
        { id: 'rejected', label: lang === 'ru' ? 'Отклоненные' : 'Відхилені', count: counts.rejected, color: 'bg-red-100 text-red-800', activeClass: 'border-red-500 text-red-800 bg-white shadow-sm' },
    ] as const;

    return (
        <div className="p-5 md:p-8 bg-gray-50 w-full min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{t.title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{t.subTitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button 
                        onClick={() => setShowHistoryModal(true)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#e02484] hover:bg-[#c0146f] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                        {t.statsBtn}
                    </button>
                    <button 
                        onClick={fetchOrders}
                        className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        {t.refreshBtn}
                    </button>
                </div>
            </div>

            {/* Status Tabs Bar */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-none">
                {tabsList.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 whitespace-nowrap cursor-pointer ${
                                isActive 
                                    ? tab.activeClass 
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${tab.color}`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* List of orders */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-gray-500 max-w-md mx-auto my-8">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-sm">{t.emptyTitle}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t.emptyDesc}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const isExpanded = !!expandedOrders[order.id];
                        // Parse items array securely
                        let itemsList: any[] = [];
                        if (order.items) {
                            try {
                                itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                            } catch (e) {
                                console.error('Error parsing order items:', e);
                            }
                        }

                        return (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all overflow-hidden">
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-extrabold text-gray-900 text-sm">{t.orderNum}{String(order.id || '').slice(0, 8)}</h3>
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    {order.created_at ? new Date(order.created_at).toLocaleString('ru-RU') : ''}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <span className="truncate font-semibold">{String(order.customer_name || t.noName)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <span className="font-mono">{String(order.customer_phone || t.noPhone)}</span>
                                                </div>
                                                {getTelegramContact(order) ? (
                                                    <a
                                                        href={getTelegramContact(order)!.url}
                                                        target={getTelegramContact(order)!.url.startsWith('tg://') ? undefined : '_blank'}
                                                        rel={getTelegramContact(order)!.url.startsWith('tg://') ? undefined : 'noreferrer'}
                                                        className="flex items-center justify-center gap-1.5 text-white bg-[#229ED9] hover:bg-[#1c81b3] px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 cursor-pointer text-center"
                                                    >
                                                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.66-.52.36-1 .54-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.57-3.27 3.6-1.5 4.35-1.76 4.84-1.77.11 0 .35.03.5.16.13.12.16.29.18.41-.01.07 0 .14-.02.2z"/>
                                                        </svg>
                                                        <span className="truncate">{t.contactTelegram}</span>
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                                        <span className="font-semibold">-</span>
                                                    </div>
                                                )}
                                            </div>

                                            {order.delivery_info && (
                                                <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                                    <div className="leading-normal">{order.delivery_info}</div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                                <div className="text-xs font-bold text-gray-900">
                                                    {t.totalSum} <span className="text-[#e02484] text-base font-extrabold">{order.total} {t.totalUnit}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {t.statusLabel} <span className="font-extrabold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md text-[11px] border border-gray-200">{order.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons matching active tab */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-2.5 w-full md:w-auto md:shrink-0 md:min-w-[160px] pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 mt-3 md:mt-0">
                                            {activeTab === 'new' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'в работе')} 
                                                        className="px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold transition-all border border-yellow-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnToWork}
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'отклонен')} 
                                                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnReject}
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'processing' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'собран')} 
                                                        className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnAssemble}
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'отклонен')} 
                                                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnReject}
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'assembled' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'отправлен на почту')} 
                                                        className="px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-all border border-green-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnShip}
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'отклонен')} 
                                                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnReject}
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'shipped' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'отклонен')} 
                                                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnReject}
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'pending')} 
                                                        className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
                                                    >
                                                        {t.btnBackToNew}
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'rejected' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'pending')} 
                                                        className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#e02484] rounded-xl text-xs font-bold transition-all border border-pink-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98 sm:col-span-2 md:col-span-1"
                                                    >
                                                        <CornerUpLeft className="w-3.5 h-3.5" /> {t.btnRestoreToNew}
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(order.id, 'в работе')} 
                                                        className="px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold transition-all border border-yellow-200/80 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98 sm:col-span-2 md:col-span-1"
                                                    >
                                                        {t.btnToWork}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Collapsible list of items */}
                                {itemsList.length > 0 && (
                                    <div className="border-t border-gray-100 bg-gray-50/50">
                                        <button 
                                            onClick={() => toggleOrderExpanded(order.id)}
                                            className="w-full px-5 py-3 flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                        >
                                            <span>{t.itemsCount.replace('{count}', String(itemsList.length))}</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="px-5 pb-5 pt-1 space-y-3 divide-y divide-gray-100">
                                                {itemsList.map((item: any, idx: number) => {
                                                    const product = item.product || {};
                                                    const img = getCleanImage(product, 0);
                                                    return (
                                                        <div key={idx} className="flex gap-4 pt-3 first:pt-0 text-xs items-center">
                                                            {img && (
                                                                <div 
                                                                    className="w-10 h-12 rounded bg-white overflow-hidden border border-gray-200 shrink-0 shadow-sm cursor-zoom-in hover:opacity-80 hover:scale-105 active:scale-95 transition-all duration-200"
                                                                    onClick={() => setZoomedImage(img)}
                                                                    title={t.tooltipZoom}
                                                                >
                                                                    <img 
                                                                        src={img} 
                                                                        alt={product.name} 
                                                                        referrerPolicy="no-referrer"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            if (target.src !== 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop') {
                                                                                target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop';
                                                                            }
                                                                        }}
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-gray-900 truncate">{product.name || (lang === 'ru' ? 'Товар' : 'Товар')}</p>
                                                                <p className="text-gray-500 mt-0.5">
                                                                    {item.size && <span className="mr-3">{t.itemSize} <strong className="text-gray-700">{item.size}</strong></span>}
                                                                    {item.color && <span>{t.itemColor} <strong className="text-gray-700">{item.color}</strong></span>}
                                                                </p>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className="font-extrabold text-gray-900">{product.price || 0} {t.totalUnit}</p>
                                                                <p className="text-gray-400">{t.itemQty} {item.quantity || 1}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Prompts Modal for Reject Reason or Track Number */}
            {promptState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100">
                        <h3 className="font-extrabold text-gray-900 text-sm mb-2">
                            {promptState.statusType === 'отклонен' ? t.promptRejectTitle : t.promptShipTitle}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">{t.promptTelegramNotice}</p>
                        <input
                             type="text"
                             value={promptState.value}
                             onChange={(e) => setPromptState({ ...promptState, value: e.target.value })}
                             placeholder={promptState.statusType === 'отклонен' ? t.promptRejectPlaceholder : t.promptShipPlaceholder}
                             className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#e02484] transition-all mb-4 font-mono"
                             autoFocus
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <button
                                onClick={() => setPromptState(null)}
                                className="px-4 py-2 font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={async () => {
                                    const val = promptState.value.trim();
                                    if (!val) return;
                                    const finalStatus = promptState.statusType === 'отклонен'
                                        ? `отклонен: ${val}`
                                        : `отправлен на почту (ТТН: ${val})`;
                                    setPromptState(null);
                                    await executeUpdateStatus(promptState.orderId, finalStatus);
                                }}
                                className="px-4 py-2 font-bold text-white bg-[#e02484] hover:bg-[#c0146f] rounded-lg transition-colors cursor-pointer"
                            >
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* General Status Confirmation Modal */}
            {confirmState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-pink-50 text-[#e02484] rounded-full">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-sm">
                                {confirmState.title}
                            </h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                             {confirmState.message}
                        </p>
                        <div className="flex justify-end gap-2 text-xs font-semibold">
                            <button
                                onClick={() => setConfirmState(null)}
                                className="px-4 py-2 font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleConfirmStatusChange}
                                className="px-4 py-2 font-bold text-white bg-[#e02484] hover:bg-[#c0146f] rounded-xl transition-colors cursor-pointer shadow-sm active:scale-98"
                            >
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox / Zoom Image Modal */}
            {zoomedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setZoomedImage(null)}
                >
                    <button 
                        onClick={() => setZoomedImage(null)}
                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white hover:text-gray-200 rounded-full transition-colors cursor-pointer"
                        title={t.close}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div 
                        className="relative max-w-full max-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={zoomedImage} 
                            alt={lang === 'ru' ? 'Увеличенное изображение' : 'Збільшене зображення'} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop') {
                                    target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop';
                                }
                            }}
                            className="max-w-[90vw] max-h-[80vh] md:max-w-4xl object-contain rounded-lg shadow-2xl" 
                        />
                    </div>
                </div>
            )}

            {/* History and Statistics Modal */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#e02484]" />
                                <div>
                                    <h3 className="font-extrabold text-gray-900 text-base">{t.historyTitle}</h3>
                                    <p className="text-xs text-gray-400">{t.historySub}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Date Pickers */}
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-5">
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#e02484]" /> {t.dateFrom}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-[#e02484] focus:outline-none shadow-sm cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#e02484]" /> {t.dateTo}
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-[#e02484] focus:outline-none shadow-sm cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Statistics Summary Widgets */}
                        {(() => {
                            const filteredShipped = orders.filter(o => {
                                if (getOrderTab(o.status) !== 'shipped') return false;
                                if (!o.created_at) return false;
                                const oDate = o.created_at.split('T')[0];
                                return oDate >= startDate && oDate <= endDate;
                            });

                            const totalOrders = filteredShipped.length;
                            const totalSum = filteredShipped.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
                            const avgValue = totalOrders ? Math.round(totalSum / totalOrders) : 0;

                            return (
                                <>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl text-center">
                                            <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">{t.statShipped}</p>
                                            <p className="text-xl font-extrabold text-green-900">{totalOrders} шт</p>
                                        </div>
                                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-center">
                                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">{t.statSum}</p>
                                            <p className="text-xl font-extrabold text-amber-900">{totalSum.toLocaleString()} {t.totalUnit}</p>
                                        </div>
                                        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl text-center">
                                            <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">{t.statAvg}</p>
                                            <p className="text-xl font-extrabold text-indigo-900">{avgValue.toLocaleString()} {t.totalUnit}</p>
                                        </div>
                                    </div>

                                    {/* Export & Print actions */}
                                    {totalOrders > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 justify-end items-center">
                                            <span className="text-[10px] font-bold text-gray-400 mr-auto uppercase tracking-wider pl-1">{t.exportLabel}</span>
                                            
                                            <button
                                                onClick={() => {
                                                    const printWindow = window.open('', '_blank');
                                                    if (!printWindow) return;
                                                    printWindow.document.write(`
                                                        <html>
                                                            <head>
                                                                <title>${t.printTitleShort.replace('{start}', startDate).replace('{end}', endDate)}</title>
                                                                <style>
                                                                    body { font-family: Arial, sans-serif; padding: 25px; color: #333; line-height: 1.4; }
                                                                    h1 { color: #e02484; font-size: 22px; margin-bottom: 5px; }
                                                                    .period { font-size: 13px; color: #666; margin-bottom: 25px; }
                                                                    .stats { display: flex; gap: 20px; margin-bottom: 30px; }
                                                                    .stat-card { border: 1px solid #e2e8f0; background: #f8fafc; padding: 15px; border-radius: 12px; flex: 1; text-align: center; }
                                                                    .stat-label { font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
                                                                    .stat-val { font-size: 20px; font-weight: 800; color: #0f172a; }
                                                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                                                                    th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
                                                                    th { background-color: #f1f5f9; font-weight: bold; color: #334155; }
                                                                    .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-t: 1px solid #e2e8f0; padding-top: 15px; }
                                                                    @media print {
                                                                        body { padding: 0; }
                                                                        .stat-card { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                                                    }
                                                                </style>
                                                            </head>
                                                            <body>
                                                                <h1>${t.printTitle}</h1>
                                                                <div class="period">${t.printPeriod.replace('{start}', startDate).replace('{end}', endDate)}</div>
                                                                
                                                                <div class="stats">
                                                                    <div class="stat-card">
                                                                        <div class="stat-label">${t.statShipped}</div>
                                                                        <div class="stat-val">${totalOrders} шт</div>
                                                                    </div>
                                                                    <div class="stat-card">
                                                                        <div class="stat-label">${t.statSum}</div>
                                                                        <div class="stat-val">${totalSum.toLocaleString()} ${t.totalUnit}</div>
                                                                    </div>
                                                                    <div class="stat-card">
                                                                        <div class="stat-label">${t.statAvg}</div>
                                                                        <div class="stat-val">${avgValue.toLocaleString()} ${t.totalUnit}</div>
                                                                    </div>
                                                                </div>

                                                                <h2>${t.historyHeader.replace(' ({count})', '')}</h2>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>${t.printTableId}</th>
                                                                            <th>${t.printTableDate}</th>
                                                                            <th>${t.printTableClient}</th>
                                                                            <th>${t.printTablePhone}</th>
                                                                            <th>${t.printTableDelivery}</th>
                                                                            <th>${t.printTableItems}</th>
                                                                            <th>${t.printTableSum}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        ${filteredShipped.map(order => {
                                                                            let itemsList = [];
                                                                            if (order.items) {
                                                                                try {
                                                                                    itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                                                                } catch (e) {}
                                                                            }
                                                                            const itemsText = itemsList.map((it: any) => {
                                                                                const name = it.product?.name || (lang === 'ru' ? 'Товар' : 'Товар');
                                                                                const sizeStr = it.size ? ` (${lang === 'ru' ? 'Р' : 'Р'}: ${it.size})` : '';
                                                                                const colorStr = it.color ? ` (${lang === 'ru' ? 'Цв' : 'Кол'}: ${it.color})` : '';
                                                                                return `${name}${sizeStr}${colorStr} x${it.quantity || 1}`;
                                                                            }).join(', ');

                                                                            return `
                                                                                <tr>
                                                                                    <td>#${String(order.id || '').slice(0, 8)}</td>
                                                                                    <td>${order.created_at ? new Date(order.created_at).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uk-UA') : ''}</td>
                                                                                    <td><strong>${String(order.customer_name || '-')}</strong></td>
                                                                                    <td>${String(order.customer_phone || '-')}</td>
                                                                                    <td>${String(order.delivery_info || '-')}</td>
                                                                                    <td>${itemsText || '-'}</td>
                                                                                    <td><strong>${order.total} ${t.totalUnit}</strong></td>
                                                                                </tr>
                                                                            `;
                                                                        }).join('')}
                                                                    </tbody>
                                                                </table>
 
                                                                <div class="footer">${t.printFooter.replace('{date}', new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'uk-UA'))}</div>
                                                                <script>
                                                                    window.onload = function() {
                                                                        window.print();
                                                                    };
                                                                </script>
                                                            </body>
                                                        </html>
                                                    `);
                                                    printWindow.document.close();
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-[#e02484] hover:text-[#c0146f] rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-pink-100 active:scale-95"
                                                title={t.tooltipPrint}
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                                {t.printBtn}
                                            </button>
 
                                            <button
                                                onClick={() => {
                                                    const BOM = '\uFEFF';
                                                    let csvContent = '';
                                                    csvContent += `${lang === 'ru' ? 'Отчет по отправленным заказам за период:' : 'Звіт по відправлених замовленнях за період:'} ${startDate} - ${endDate}\n`;
                                                    csvContent += `${lang === 'ru' ? 'Всего отправлено заказов:;' : 'Всього відправлено замовлень:;'}${totalOrders};${lang === 'ru' ? 'шт' : 'шт'}\n`;
                                                    csvContent += `${lang === 'ru' ? 'Общая сумма:;' : 'Загальна сума:;'}${totalSum};${t.totalUnit}\n`;
                                                    csvContent += `${lang === 'ru' ? 'Средний чек:;' : 'Середній чек:;'}${avgValue};${t.totalUnit}\n\n`;
                                                    csvContent += `${lang === 'ru' ? 'ID Заказа;Дата;Клиент;Телефон;Информация по доставке;Товары (Кол-во x Цена);Итоговая сумма (грн)' : 'ID Замовлення;Дата;Клієнт;Телефон;Інформація по доставці;Товари (К-сть x Ціна);Підсумкова сума (грн)'}\n`;
                                                    
                                                    filteredShipped.forEach(order => {
                                                        let itemsList = [];
                                                        if (order.items) {
                                                            try {
                                                                itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                                            } catch (e) {}
                                                        }
                                                        const itemsText = itemsList.map((it: any) => {
                                                            const name = String(it.product?.name || (lang === 'ru' ? 'Товар' : 'Товар')).replace(/;/g, ',');
                                                            const sizeStr = it.size ? ` (${lang === 'ru' ? 'Р' : 'Р'}: ${it.size})` : '';
                                                            const colorStr = it.color ? ` (${lang === 'ru' ? 'Цв' : 'Кол'}: ${it.color})` : '';
                                                            return `${name}${sizeStr}${colorStr} x${it.quantity || 1}`;
                                                        }).join(' | ');

                                                        const orderId = String(order.id || '').slice(0, 8);
                                                        const dateStr = order.created_at ? new Date(order.created_at).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uk-UA') : '';
                                                        const name = String(order.customer_name || '').replace(/;/g, ',');
                                                        const phone = String(order.customer_phone || '').replace(/;/g, ',');
                                                        const delivery = String(order.delivery_info || '').replace(/;/g, ',').replace(/\n/g, ' ');
                                                        const total = order.total || 0;
                                                        
                                                        csvContent += `${orderId};${dateStr};${name};${phone};${delivery};${itemsText};${total}\n`;
                                                    });
                                                    
                                                    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
                                                    const url = URL.createObjectURL(blob);
                                                    const link = document.createElement('a');
                                                    link.setAttribute('href', url);
                                                    link.setAttribute('download', `report_orders_${startDate}_to_${endDate}.csv`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-emerald-100 active:scale-95"
                                                title={t.tooltipCsv}
                                            >
                                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                                {t.csvBtn}
                                            </button>
 
                                            <button
                                                onClick={() => {
                                                    const reportData = {
                                                        report_period: { start_date: startDate, end_date: endDate },
                                                        statistics: {
                                                            total_orders: totalOrders,
                                                            total_sum: totalSum,
                                                            average_check: avgValue
                                                        },
                                                        orders: filteredShipped.map(order => {
                                                            let itemsList = [];
                                                            if (order.items) {
                                                                try {
                                                                    itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                                                } catch (e) {}
                                                            }
                                                            return {
                                                                id: order.id,
                                                                short_id: String(order.id || '').slice(0, 8),
                                                                created_at: order.created_at,
                                                                customer_name: String(order.customer_name || ''),
                                                                customer_phone: String(order.customer_phone || ''),
                                                                delivery_info: String(order.delivery_info || ''),
                                                                total: order.total,
                                                                status: order.status,
                                                                items: itemsList.map((it: any) => ({
                                                                    product_id: it.product?.id,
                                                                    name: it.product?.name,
                                                                    price: it.product?.price,
                                                                    quantity: it.quantity,
                                                                    size: it.size,
                                                                    color: it.color
                                                                }))
                                                            };
                                                        })
                                                    };
 
                                                    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                                                    const url = URL.createObjectURL(blob);
                                                    const link = document.createElement('a');
                                                    link.setAttribute('href', url);
                                                    link.setAttribute('download', `report_orders_${startDate}_to_${endDate}.json`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-gray-200 active:scale-95"
                                                title={t.tooltipJson}
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                JSON
                                            </button>
                                        </div>
                                    )}

                                    {/* Scrollable list of shipped orders */}
                                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[150px]">
                                        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">{t.historyHeader.replace('{count}', String(totalOrders))}</h4>
                                        {filteredShipped.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                                                <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                                                <p className="text-xs">{lang === 'ru' ? 'Нет отправленных заказов за этот период' : 'Немає відправлених замовлень за цей період'}</p>
                                            </div>
                                        ) : (
                                            filteredShipped.map(order => {
                                                let itemsList: any[] = [];
                                                if (order.items) {
                                                    try {
                                                        itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                                    } catch (e) {
                                                        console.error('Error parsing order items:', e);
                                                    }
                                                }

                                                const isExpanded = !!expandedOrders[`history_${order.id}`];

                                                return (
                                                    <div key={order.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs text-left">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-extrabold text-gray-900">{t.orderNum}{String(order.id || '').slice(0, 8)}</span>
                                                            <span className="text-gray-400 font-mono text-[10px]">
                                                                {order.created_at ? new Date(order.created_at).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uk-UA') : ''}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                                                            <div>👤 <strong>{String(order.customer_name || (lang === 'ru' ? 'Без имени' : 'Без імені'))}</strong></div>
                                                            <div>📞 <span className="font-mono">{String(order.customer_phone || (lang === 'ru' ? 'Без телефона' : 'Без телефону'))}</span></div>
                                                            {order.delivery_info && (
                                                                <div className="col-span-2 text-gray-500 italic mt-0.5 leading-tight">
                                                                    📍 {String(order.delivery_info)}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-gray-700 font-medium">
                                                            <div>{t.totalSum} <span className="text-[#e02484] font-extrabold">{order.total} {t.totalUnit}</span></div>
                                                            <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-bold">
                                                                {order.status}
                                                            </div>
                                                        </div>

                                                        {itemsList.length > 0 && (
                                                            <div className="pt-1.5 border-t border-gray-200/40">
                                                                <button
                                                                    onClick={() => setExpandedOrders(prev => ({ ...prev, [`history_${order.id}`]: !isExpanded }))}
                                                                    className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 hover:text-gray-600"
                                                                >
                                                                    <span>{lang === 'ru' ? 'Состав' : 'Склад'} ({itemsList.length})</span>
                                                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                                </button>
                                                                {isExpanded && (
                                                                    <div className="mt-1.5 space-y-2 bg-white p-2.5 rounded-xl border border-gray-100/80 divide-y divide-gray-50">
                                                                        {itemsList.map((item: any, idx: number) => {
                                                                            const product = item.product || {};
                                                                            const img = getCleanImage(product, 0);
                                                                            return (
                                                                                <div key={idx} className="flex gap-2.5 pt-1.5 first:pt-0 items-center text-[11px]">
                                                                                    {img && (
                                                                                        <img 
                                                                                            src={img} 
                                                                                            alt="" 
                                                                                            referrerPolicy="no-referrer"
                                                                                            onClick={() => setZoomedImage(img)}
                                                                                            title={lang === 'ru' ? 'Нажмите для увеличения' : 'Натисніть для збільшення'}
                                                                                            onError={(e) => {
                                                                                                const target = e.target as HTMLImageElement;
                                                                                                if (target.src !== 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop') {
                                                                                                    target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop';
                                                                                                }
                                                                                            }}
                                                                                            className="w-6 h-8 object-cover rounded border border-gray-100 shadow-sm cursor-zoom-in hover:opacity-80 hover:scale-105 active:scale-95 transition-all duration-200" 
                                                                                        />
                                                                                    )}
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="font-bold text-gray-800 truncate">{product.name}</p>
                                                                                        <p className="text-gray-400 text-[10px]">
                                                                                            {item.size && `${lang === 'ru' ? 'Размер' : 'Розмір'}: ${item.size} `}
                                                                                            {item.color && `${lang === 'ru' ? 'Цвет' : 'Колір'}: ${item.color}`}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <p className="font-bold text-gray-800">{product.price} {t.totalUnit}</p>
                                                                                        <p className="text-[10px] text-gray-400">x{item.quantity || 1}</p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </>
                            );
                        })()}

                        {/* Footer */}
                        <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end">
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="px-5 py-2 font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                {t.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

