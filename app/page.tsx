'use client';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus } from 'lucide-react';

const TIMES = ['09:00', '12:00', '17:00', '20:00', '21:00'];
const DAYS_COUNT = 7;

const CELL_WIDTH = 150;
const CELL_HEIGHT = 250;

export default function Planner() {
  const [days] = useState(() => Array.from({ length: DAYS_COUNT }, (_, i) => addDays(new Date(), i)));

  // Заглушка постов и тизеров (потом подключишь NocoDB)
  const [posts, setPosts] = useState<any[]>([]);
  const [teasers, setTeasers] = useState<any[]>([]);

  useEffect(() => {
    setTeasers(Array.from({ length: 12 }, (_, i) => ({
      id: `teaser-${i}`,
      title: `Тизер ${i + 1}`,
      preview: '🖼️'
    })));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-white">
        Планировщик постов в Telegram
      </h1>

      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${DAYS_COUNT + 1}, ${CELL_WIDTH}px)` }}>
          {/* Пустая ячейка в левом верхнем углу */}
          <div className="bg-zinc-900 border border-zinc-700 h-[60px] flex items-center justify-center text-sm text-zinc-400">
            Время / Дата
          </div>

          {/* Даты сверху */}
          {days.map((day, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-700 h-[60px] flex items-center justify-center text-sm text-zinc-400">
              {format(day, 'dd.MM', { locale: ru })}
              {i === 0 && <span className="ml-1 text-emerald-400 text-xs">(Сегодня)</span>}
            </div>
          ))}

          {/* Строки по времени */}
          {TIMES.map((time, tIdx) => (
            <>
              {/* Время слева */}
              <div className="bg-zinc-900 border border-zinc-700 h-[${CELL_HEIGHT}px] flex items-center justify-center text-sm text-zinc-400">
                {time}
              </div>

              {/* Ячейки слотов */}
              {days.map((_, dIdx) => (
                <div
                  key={`${dIdx}-${tIdx}`}
                  className="bg-zinc-900 border border-zinc-700 h-[${CELL_HEIGHT}px] flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors relative group"
                >
                  <div className="text-center text-zinc-500 opacity-70 group-hover:opacity-100">
                    <Plus size={32} className="mx-auto mb-2" />
                    <div className="text-xs">Добавить пост</div>
                  </div>
                </div>
              ))}
            </>
          ))}
        </div>
      </div>

      {/* Галерея тизеров справа (пока заглушка) */}
      <div className="mt-8 lg:mt-0 lg:fixed lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:w-80 bg-zinc-900 rounded-2xl p-6 overflow-y-auto max-h-[80vh]">
        <h2 className="font-bold text-xl mb-6">Галерея тизеров</h2>
        <div className="grid grid-cols-2 gap-4">
          {teasers.map(t => (
            <div
              key={t.id}
              className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center text-5xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all"
            >
              {t.preview}
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-6 text-center">
          Перетаскивай тизеры в слоты
        </p>
      </div>
    </div>
  );
}
