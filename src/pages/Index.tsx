import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface App {
  id: number;
  name: string;
  icon: string;
  category: string;
  downloads: string;
}

interface ChatMessage {
  id: number;
  author: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

const APPS: App[] = [
  { id: 1, name: 'iPhone (iOS)', icon: 'Smartphone', category: 'Система', downloads: '1.5 млрд' },
  { id: 2, name: 'Minecraft', icon: 'Gamepad2', category: 'Игры', downloads: '500 млн' },
  { id: 3, name: 'Standoff 2', icon: 'Crosshair', category: 'Игры', downloads: '100 млн' },
  { id: 4, name: 'Google', icon: 'Globe', category: 'Поиск', downloads: '5 млрд' },
  { id: 5, name: 'Microsoft', icon: 'Monitor', category: 'Бизнес', downloads: '2 млрд' },
  { id: 6, name: 'Пятёрочка', icon: 'ShoppingCart', category: 'Покупки', downloads: '50 млн' },
  { id: 7, name: 'WhatsApp', icon: 'MessageCircle', category: 'Общение', downloads: '3 млрд' },
  { id: 8, name: 'Telegram', icon: 'Send', category: 'Общение', downloads: '800 млн' },
  { id: 9, name: 'VK', icon: 'Users', category: 'Социальные', downloads: '300 млн' },
  { id: 10, name: 'YouTube', icon: 'Play', category: 'Видео', downloads: '4 млрд' },
  { id: 11, name: 'TikTok', icon: 'Music', category: 'Видео', downloads: '3.5 млрд' },
  { id: 12, name: 'Instagram', icon: 'Instagram', category: 'Социальные', downloads: '2.5 млрд' },
  { id: 13, name: 'Facebook', icon: 'Facebook', category: 'Социальные', downloads: '3 млрд' },
  { id: 14, name: 'Spotify', icon: 'Music', category: 'Музыка', downloads: '600 млн' },
  { id: 15, name: 'Netflix', icon: 'Tv', category: 'Видео', downloads: '800 млн' },
  { id: 16, name: 'Amazon', icon: 'Package', category: 'Покупки', downloads: '1 млрд' },
  { id: 17, name: 'Uber', icon: 'Car', category: 'Транспорт', downloads: '500 млн' },
  { id: 18, name: 'Яндекс.Такси', icon: 'Car', category: 'Транспорт', downloads: '100 млн' },
  { id: 19, name: 'Сбербанк', icon: 'CreditCard', category: 'Финансы', downloads: '200 млн' },
  { id: 20, name: 'Тинькофф', icon: 'Wallet', category: 'Финансы', downloads: '150 млн' },
  { id: 21, name: 'Avito', icon: 'Store', category: 'Покупки', downloads: '80 млн' },
  { id: 22, name: 'Ozon', icon: 'ShoppingBag', category: 'Покупки', downloads: '70 млн' },
  { id: 23, name: 'Wildberries', icon: 'ShoppingBasket', category: 'Покупки', downloads: '90 млн' },
  { id: 24, name: 'Яндекс', icon: 'Search', category: 'Поиск', downloads: '250 млн' },
  { id: 25, name: 'Discord', icon: 'MessageSquare', category: 'Общение', downloads: '400 млн' },
  { id: 26, name: 'Zoom', icon: 'Video', category: 'Бизнес', downloads: '600 млн' },
  { id: 27, name: 'Viber', icon: 'Phone', category: 'Общение', downloads: '1.2 млрд' },
  { id: 28, name: 'Twitter (X)', icon: 'Twitter', category: 'Социальные', downloads: '500 млн' },
  { id: 29, name: 'LinkedIn', icon: 'Briefcase', category: 'Бизнес', downloads: '900 млн' },
  { id: 30, name: 'Snapchat', icon: 'Camera', category: 'Социальные', downloads: '750 млн' },
  { id: 31, name: 'Roblox', icon: 'Box', category: 'Игры', downloads: '450 млн' },
  { id: 32, name: 'Max (HBO Max)', icon: 'Film', category: 'Видео', downloads: '300 млн' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [blockedApps, setBlockedApps] = useState<number[]>([]);
  const [blockHistory, setBlockHistory] = useState<{ appName: string; timestamp: Date }[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showBlockAnimation, setShowBlockAnimation] = useState(false);
  const [animatingAppId, setAnimatingAppId] = useState<number | null>(null);
  const [showBlockedError, setShowBlockedError] = useState(false);
  const [errorApp, setErrorApp] = useState<App | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const userNames = [
    'Александр К.', 'Мария П.', 'Дмитрий В.', 'Анна С.', 'Иван М.',
    'Елена Р.', 'Сергей Л.', 'Ольга Н.', 'Андрей Т.', 'Наталья Ж.',
    'Михаил Б.', 'Татьяна Д.', 'Алексей Г.', 'Светлана К.', 'Павел Ш.'
  ];

  const complaintMessages = [
    'Верните приложение! Оно мне нужно для работы!',
    'Почему заблокировали? Это несправедливо!',
    'Я требую разблокировать приложение немедленно!',
    'Верните доступ! Без этого приложения никак!',
    'Это нарушение моих прав! Разблокируйте!',
    'Прошу вернуть приложение, очень нужно!',
    'Где мое приложение? Верните обратно!',
    'Незаконная блокировка! Требую вернуть!',
    'Пожалуйста, разблокируйте! Очень важно!',
    'Верните приложение, это катастрофа!',
    'Почему так? Верните доступ пожалуйста!',
    'Я против блокировки! Верните приложение!',
    'Это ужасно! Разблокируйте немедленно!',
    'Требую объяснений! Верните приложение!',
    'Не могу без этого приложения! Верните!'
  ];

  useEffect(() => {
    if (blockedApps.length > 0) {
      const interval = setInterval(() => {
        const randomName = userNames[Math.floor(Math.random() * userNames.length)];
        const randomMessage = complaintMessages[Math.floor(Math.random() * complaintMessages.length)];
        const randomApp = APPS.find(app => blockedApps.includes(app.id));
        
        const newMessage: ChatMessage = {
          id: Date.now(),
          author: randomName,
          message: randomApp ? `${randomMessage} (${randomApp.name})` : randomMessage,
          timestamp: new Date(),
          avatar: randomName.charAt(0)
        };
        
        setChatMessages(prev => [...prev, newMessage].slice(-50));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [blockedApps]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAppClick = (app: App) => {
    if (blockedApps.includes(app.id)) {
      toast.error(`${app.name} уже заблокирован`);
      return;
    }
    setSelectedApp(app);
    setShowDialog(true);
  };

  const handleBlock = () => {
    if (selectedApp) {
      setShowDialog(false);
      setAnimatingAppId(selectedApp.id);
      setShowBlockAnimation(true);
      
      setTimeout(() => {
        setBlockedApps([...blockedApps, selectedApp.id]);
        setBlockHistory([
          { appName: selectedApp.name, timestamp: new Date() },
          ...blockHistory,
        ]);
        toast.success(`${selectedApp.name} заблокирован`);
        setShowBlockAnimation(false);
        setAnimatingAppId(null);
        
        setTimeout(() => {
          setActiveTab('playmarket');
        }, 500);
      }, 5000);
    }
  };

  const handleUnblock = (appId: number) => {
    const app = APPS.find(a => a.id === appId);
    setBlockedApps(blockedApps.filter(id => id !== appId));
    if (app) {
      toast.info(`${app.name} разблокирован`);
    }
  };

  const handleInstallClick = (app: App) => {
    if (blockedApps.includes(app.id)) {
      setErrorApp(app);
      setShowBlockedError(true);
    } else {
      toast.success(`Установка ${app.name} началась`);
    }
  };

  const filteredApps = APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const availableApps = filteredApps.filter(app => !blockedApps.includes(app.id));
  const blockedAppsList = APPS.filter(app => blockedApps.includes(app.id));
  const categories = ['all', ...Array.from(new Set(APPS.map(app => app.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-primary text-primary-foreground shadow-lg border-b-4 border-destructive">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">РОСКОМНАДЗОР</h1>
                <p className="text-sm opacity-90 font-medium">Федеральная служба по надзору в сфере связи</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="destructive" className="px-4 py-2 text-sm font-bold">
                ОФИЦИАЛЬНО
              </Badge>
              {blockedApps.length > 0 && (
                <Button
                  onClick={() => setShowChat(!showChat)}
                  variant="outline"
                  className="relative font-bold"
                >
                  <Icon name="MessageSquare" size={20} className="mr-2" />
                  Обращения ({chatMessages.length})
                  {chatMessages.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      !
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white shadow-md">
            <TabsTrigger value="home" className="font-bold text-base data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Icon name="Home" className="mr-2" size={20} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="apps" className="font-bold text-base data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Icon name="Grid3x3" className="mr-2" size={20} />
              Приложения
            </TabsTrigger>
            <TabsTrigger value="blocked" className="font-bold text-base data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Icon name="Ban" className="mr-2" size={20} />
              Заблокировано ({blockedApps.length})
            </TabsTrigger>
            <TabsTrigger value="playmarket" className="font-bold text-base data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Icon name="Store" className="mr-2" size={20} />
              PlayMarket
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary to-slate-800 text-white">
                <CardTitle className="text-3xl font-black">Система контроля приложений</CardTitle>
                <CardDescription className="text-slate-200 text-base">
                  Управление доступностью мобильных приложений на территории РФ
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-destructive">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Database" size={28} className="text-destructive" />
                      <h3 className="font-bold text-xl">Всего приложений</h3>
                    </div>
                    <p className="text-4xl font-black text-primary">{APPS.length}</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg border-l-4 border-destructive">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Ban" size={28} className="text-destructive" />
                      <h3 className="font-bold text-xl">Заблокировано</h3>
                    </div>
                    <p className="text-4xl font-black text-destructive">{blockedApps.length}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="CheckCircle" size={28} className="text-green-600" />
                      <h3 className="font-bold text-xl">Доступно</h3>
                    </div>
                    <p className="text-4xl font-black text-green-600">{APPS.length - blockedApps.length}</p>
                  </div>
                </div>

                <div className="border-t-2 pt-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Icon name="History" size={24} />
                    История блокировок
                  </h3>
                  {blockHistory.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 bg-slate-50 rounded-lg">
                      История блокировок пуста
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {blockHistory.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                          <span className="font-medium">{item.appName}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.timestamp.toLocaleString('ru-RU')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setActiveTab('apps')}
                  className="w-full h-14 text-lg font-bold bg-destructive hover:bg-red-700"
                  size="lg"
                >
                  <Icon name="ShieldAlert" className="mr-2" size={24} />
                  Перейти к блокировке приложений
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apps" className="space-y-6 animate-fade-in">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-primary text-white">
                <CardTitle className="text-2xl font-black">Список приложений для блокировки</CardTitle>
                <CardDescription className="text-slate-200">
                  Выберите приложение для блокировки
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Поиск приложений..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-12 px-4 border rounded-md bg-white font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'Все категории' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApps.map((app) => (
                    <Card
                      key={app.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                        blockedApps.includes(app.id) ? 'opacity-50 bg-red-50 border-destructive' : 'hover:border-destructive'
                      }`}
                      onClick={() => handleAppClick(app)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon name={app.icon} size={28} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg mb-1 truncate">{app.name}</h3>
                            <p className="text-sm text-muted-foreground">{app.category}</p>
                            <p className="text-xs text-muted-foreground mt-1">{app.downloads} загрузок</p>
                          </div>
                          {blockedApps.includes(app.id) && (
                            <Badge variant="destructive" className="font-bold">
                              <Icon name="Ban" size={14} className="mr-1" />
                              БЛОК
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredApps.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="SearchX" size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Приложения не найдены</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6 animate-fade-in">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-destructive text-white">
                <CardTitle className="text-2xl font-black">Заблокированные приложения</CardTitle>
                <CardDescription className="text-red-100">
                  Управление заблокированными приложениями
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {blockedAppsList.length === 0 ? (
                  <div className="text-center py-16">
                    <Icon name="CheckCircle" size={64} className="mx-auto mb-4 text-green-600" />
                    <p className="text-xl font-bold text-muted-foreground">
                      Заблокированных приложений нет
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Перейдите во вкладку "Приложения" для блокировки
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {blockedAppsList.map((app) => (
                      <Card key={app.id} className="border-2 border-destructive bg-red-50">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-14 h-14 bg-destructive rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon name={app.icon} size={28} className="text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg mb-1">{app.name}</h3>
                                <p className="text-sm text-muted-foreground">{app.category}</p>
                                <Badge variant="destructive" className="mt-2 font-bold">
                                  <Icon name="Ban" size={14} className="mr-1" />
                                  ЗАБЛОКИРОВАНО
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnblock(app.id)}
                              className="flex-shrink-0 font-bold"
                            >
                              <Icon name="Unlock" size={16} className="mr-1" />
                              Разблокировать
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playmarket" className="space-y-6 animate-fade-in">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <Icon name="Store" size={28} />
                  Google Play Market
                </CardTitle>
                <CardDescription className="text-green-100">
                  Доступные приложения для загрузки
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {blockedApps.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <div className="flex gap-2">
                      <Icon name="AlertTriangle" className="text-yellow-600 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-yellow-900">
                          Заблокировано приложений: {blockedApps.length}
                        </p>
                        <p className="text-sm text-yellow-800">
                          Эти приложения больше не отображаются в магазине
                        </p>
                      </div>
                    </div>
                  </div>
                )}

{availableApps.length === 0 ? (
                  <div className="text-center py-16">
                    <Icon name="Ban" size={64} className="mx-auto mb-4 text-destructive" />
                    <p className="text-xl font-bold text-muted-foreground">
                      Все приложения заблокированы
                    </p>
                    <p className="text-muted-foreground mt-2">
                      В PlayMarket не осталось доступных приложений
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {APPS.map((app) => (
                      <Card
                        key={app.id}
                        className={`transition-all ${
                          blockedApps.includes(app.id)
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:shadow-lg cursor-pointer hover:-translate-y-1'
                        }`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              blockedApps.includes(app.id)
                                ? 'bg-gray-400'
                                : 'bg-gradient-to-br from-green-600 to-blue-600'
                            }`}>
                              <Icon name={app.icon} size={28} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg mb-1 truncate">{app.name}</h3>
                              <p className="text-sm text-muted-foreground">{app.category}</p>
                              <p className="text-xs text-muted-foreground mt-1">{app.downloads}</p>
                              {blockedApps.includes(app.id) ? (
                                <Button 
                                  size="sm" 
                                  className="mt-3 w-full bg-gray-400 cursor-not-allowed font-bold"
                                  onClick={() => handleInstallClick(app)}
                                >
                                  <Icon name="Ban" size={16} className="mr-1" />
                                  Заблокировано
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="mt-3 w-full bg-green-600 hover:bg-green-700 font-bold"
                                  onClick={() => handleInstallClick(app)}
                                >
                                  <Icon name="Download" size={16} className="mr-1" />
                                  Установить
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-destructive flex items-center gap-2">
              <Icon name="ShieldAlert" size={28} />
              Подтверждение блокировки
            </DialogTitle>
            <DialogDescription className="text-base">
              Вы действительно хотите заблокировать это приложение?
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border-2">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Icon name={selectedApp.icon} size={32} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{selectedApp.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedApp.category}</p>
                <p className="text-xs text-muted-foreground">{selectedApp.downloads} загрузок</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="flex-1 font-bold"
            >
              <Icon name="X" size={18} className="mr-2" />
              Нет, отменить
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlock}
              className="flex-1 font-bold"
            >
              <Icon name="Ban" size={18} className="mr-2" />
              Да, заблокировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="bg-primary text-white mt-16 py-8 border-t-4 border-destructive">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-lg">Федеральная служба по надзору в сфере связи, информационных технологий и массовых коммуникаций</p>
          <p className="text-sm opacity-80 mt-2">© 2025 Роскомнадзор. Все права защищены.</p>
        </div>
      </footer>

      {showBlockAnimation && selectedApp && (
        <div className="block-animation-overlay">
          <div className="text-center">
            <div className="x-mark mb-8"></div>
            <div className="text-white">
              <h2 className="text-4xl font-black mb-4">БЛОКИРОВКА</h2>
              <p className="text-2xl font-bold">{selectedApp.name}</p>
              <p className="text-lg mt-2 opacity-90">Приложение заблокировано</p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showBlockedError} onOpenChange={setShowBlockedError}>
        <DialogContent className="sm:max-w-md border-4 border-destructive">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-destructive flex items-center gap-2">
              <Icon name="ShieldX" size={32} />
              Ошибка установки
            </DialogTitle>
            <DialogDescription className="text-base">
              Невозможно установить приложение
            </DialogDescription>
          </DialogHeader>
          {errorApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border-2 border-destructive">
                <div className="w-16 h-16 bg-destructive rounded-xl flex items-center justify-center">
                  <Icon name={errorApp.icon} size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{errorApp.name}</h3>
                  <p className="text-sm text-muted-foreground">{errorApp.category}</p>
                </div>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg border-l-4 border-destructive">
                <div className="flex gap-3">
                  <Icon name="AlertCircle" className="text-destructive flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-bold text-destructive text-lg">ПРИЛОЖЕНИЕ ЗАБЛОКИРОВАНО</p>
                    <p className="text-sm mt-2">
                      Данное приложение заблокировано Роскомнадзором на территории Российской Федерации.
                    </p>
                    <p className="text-sm mt-2 font-medium">
                      Установка и использование невозможны по решению регулятора.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setShowBlockedError(false)}
              className="w-full font-bold"
            >
              <Icon name="X" size={18} className="mr-2" />
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}