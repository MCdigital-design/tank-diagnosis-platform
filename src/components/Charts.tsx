import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { healthDistribution, utilization } from '../data/mock'

export function UtilizationGauge({ highlightPercent }: { highlightPercent?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption({
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          radius: '95%',
          pointer: { show: false },
          progress: {
            show: true,
            width: 10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#1a6bff' },
                { offset: 1, color: '#00d4ff' },
              ]),
            },
          },
          axisLine: { lineStyle: { width: 10, color: [[1, 'rgba(30,80,140,0.5)']] } },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            color: '#7dd3fc',
            fontSize: 22,
            fontWeight: 700,
            offsetCenter: [0, '0%'],
          },
          data: [{ value: utilization.percent }],
        },
      ],
    })
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [highlightPercent])

  return <div className="gauge-chart" ref={ref} />
}

export function HealthDonut({ highlightHealth }: { highlightHealth?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['52%', '72%'],
          center: ['38%', '50%'],
          label: { show: false },
          data: healthDistribution.map((d) => {
            const parts = d.range.split('-').map((n) => parseInt(n, 10))
            const lo = parts[0]
            const hi = parts[1] ?? 100
            const match =
              highlightHealth !== undefined && highlightHealth >= lo && highlightHealth <= hi
            return {
              name: d.label,
              value: d.count,
              itemStyle: {
                color: d.color,
                opacity: highlightHealth === undefined ? 1 : match ? 1 : 0.35,
              },
            }
          }),
        },
      ],
    })
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [highlightHealth])

  return <div className="donut-chart" ref={ref} />
}
