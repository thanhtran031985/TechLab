import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  FileText,
  Search,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const kpis = [
    { label: 'Tổng số khóa học', value: '1', icon: BookOpen },
    { label: 'Module hoàn thành', value: '0 / 10', icon: CheckCircle2 },
    { label: 'Challenge đã đạt', value: '0 / 30', icon: Trophy },
    { label: 'Ghi chú đã lưu', value: '0', icon: FileText },
  ];

  const courses = [
    {
      slug: 'rest-api',
      title: 'REST API Design Like a Senior Engineer',
      channel: 'System Design Lab',
      videoUrl: 'https://www.youtube.com/watch?v=BvtIqaiabJA',
      moduleCount: 10,
      challengeProgress: '0 / 30',
      status: 'Chưa bắt đầu',
      statusClass: 'bg-off-soft text-off',
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 gap-4 overflow-y-auto">
      {/* 1-Line Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line shrink-0">
        <div>
          <h1 className="text-[18px] font-semibold text-ink leading-tight">
            Danh sách khóa học
          </h1>
          <p className="text-[12px] text-ink-soft">
            Chuyển hóa video chuyên sâu thành Interactive Sandbox với Junior vs Senior Mode
          </p>
        </div>

        <Link
          href="/courses/rest-api/01-network-http-rest"
          className="flex items-center gap-1.5 h-[30px] px-3 rounded-[4px] bg-primary text-on-primary text-[12px] font-medium hover:bg-primary-hover transition-colors"
        >
          <span>Tiếp tục bài gần nhất</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 4 Compact KPIs */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-card bg-surface border border-line shadow-card"
            >
              <div>
                <div className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider">
                  {kpi.label}
                </div>
                <div className="text-[20px] font-semibold text-ink mt-0.5 tabular-nums">
                  {kpi.value}
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-soft text-primary shrink-0">
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Command Bar */}
      <div className="flex items-center justify-between gap-3 h-[40px] px-3 rounded-card bg-surface border border-line shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search size={14} className="text-ink-soft shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full bg-transparent text-[12px] text-ink placeholder:text-ink-soft outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          {['Tất cả', 'Đang học', 'Hoàn thành', 'Chưa bắt đầu'].map((filter, i) => (
            <button
              key={filter}
              className={`h-[26px] px-2.5 rounded-[4px] text-[11px] font-semibold transition-colors ${
                i === 0
                  ? 'bg-primary-soft text-primary'
                  : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Courses Table */}
      <div className="flex-1 min-h-[200px] rounded-card bg-surface border border-line overflow-hidden flex flex-col shadow-card">
        <div className="grid grid-cols-12 gap-2 h-[32px] items-center px-4 bg-surface-2 border-b border-line text-[11px] font-semibold text-ink-soft uppercase tracking-wider shrink-0">
          <div className="col-span-5">Tên khóa học</div>
          <div className="col-span-3">Nguồn video</div>
          <div className="col-span-1 text-right">Số module</div>
          <div className="col-span-1 text-right">Challenge</div>
          <div className="col-span-1 text-center">Trạng thái</div>
          <div className="col-span-1 text-right">Hành động</div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-line">
          {courses.map((course) => (
            <div
              key={course.slug}
              className="grid grid-cols-12 gap-2 h-[40px] items-center px-4 hover:bg-surface-2 transition-colors text-[12px]"
            >
              <div className="col-span-5 font-semibold text-ink truncate">
                {course.title}
              </div>

              <div className="col-span-3 flex items-center gap-1.5 text-ink-soft truncate">
                <span>{course.channel}</span>
                <a
                  href={course.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                  title="Mở video YouTube"
                >
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="col-span-1 text-right tabular-nums text-ink">
                {course.moduleCount}
              </div>

              <div className="col-span-1 text-right tabular-nums text-ink-soft">
                {course.challengeProgress}
              </div>

              <div className="col-span-1 flex justify-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-chip text-[11px] font-semibold ${course.statusClass}`}
                >
                  {course.status}
                </span>
              </div>

              <div className="col-span-1 flex justify-end">
                <Link
                  href={`/courses/${course.slug}`}
                  className="h-[26px] px-2.5 rounded-[4px] border border-line text-[11px] font-medium text-ink hover:bg-primary-soft hover:text-primary hover:border-primary transition-colors flex items-center gap-1"
                >
                  <span>Mở</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
