import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { SensorStatus, SensorTimePoint } from '../data/floatingRoofSensors'
import { SENSOR_STATUS_COLORS } from '../data/floatingRoofSensors'
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

export function SensorTimeSeriesChart({
  points,
  unit,
  status,
}: {
  points: SensorTimePoint[]
  unit: string
  status: SensorStatus
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    const color = SENSOR_STATUS_COLORS[status]
    chart.setOption({
      grid: { left: 36, right: 12, top: 12, bottom: 22 },
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const p = (params as { dataIndex: number }[])[0]
          if (!p) return ''
          const pt = points[p.dataIndex]
          return `${pt.time}<br/>${pt.value} ${unit}`
        },
      },
      xAxis: {
        type: 'category',
        data: points.map((p) => p.time),
        axisLabel: { color: '#6a8aaa', fontSize: 9, interval: 3 },
        axisLine: { lineStyle: { color: 'rgba(56,120,200,0.35)' } },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: { color: '#6a8aaa', fontSize: 9 },
        splitLine: { lineStyle: { color: 'rgba(30,70,120,0.25)' } },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: points.map((p) => p.value),
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color:
                  status === 'alarm'
                    ? 'rgba(255,77,109,0.35)'
                    : status === 'warn'
                      ? 'rgba(255,179,71,0.35)'
                      : 'rgba(0,229,160,0.35)',
              },
              { offset: 1, color: 'rgba(0,0,0,0)' },
            ]),
          },
        },
      ],
    })
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [points, unit, status])

  return <div className="sensor-ts-chart" ref={ref} />
}
