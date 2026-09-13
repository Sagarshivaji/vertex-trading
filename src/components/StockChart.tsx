import { useEffect, useRef } from 'react'
import { createChart, AreaSeries, HistogramSeries, ColorType, type IChartApi, type ISeriesApi, type UTCTimestamp } from 'lightweight-charts'
import type { Candle } from '../types'

interface StockChartProps {
  data: Candle[]
  positive: boolean
  height?: number
  showVolume?: boolean
}

export function StockChart({ data, positive, height = 360, showVolume = true }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8994a3',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: showVolume ? 0.28 : 0.06 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { color: 'rgba(255,255,255,0.25)', width: 1, style: 3, labelBackgroundColor: '#1a2330' },
        horzLine: { color: 'rgba(255,255,255,0.25)', width: 1, style: 3, labelBackgroundColor: '#1a2330' },
      },
      autoSize: true,
    })

    const color = positive ? '#2fd480' : '#ff5c72'
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      lineWidth: 2,
      topColor: `${color}33`,
      bottomColor: `${color}00`,
      priceLineVisible: false,
      lastValueVisible: true,
    })

    let volumeSeries: ISeriesApi<'Histogram'> | null = null
    if (showVolume) {
      volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
        color: 'rgba(90,103,121,0.5)',
      })
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.82, bottom: 0 },
      })
    }

    chartRef.current = chart
    areaSeriesRef.current = areaSeries
    volumeSeriesRef.current = volumeSeries

    return () => {
      chart.remove()
      chartRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVolume])

  useEffect(() => {
    if (!areaSeriesRef.current || !chartRef.current) return
    const color = positive ? '#2fd480' : '#ff5c72'
    areaSeriesRef.current.applyOptions({ lineColor: color, topColor: `${color}33`, bottomColor: `${color}00` })

    const areaData = data.map((c) => ({ time: c.time as UTCTimestamp, value: c.close }))
    areaSeriesRef.current.setData(areaData)

    if (volumeSeriesRef.current) {
      const volData = data.map((c, i) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: i > 0 && c.close >= data[i - 1].close ? 'rgba(47,212,128,0.4)' : 'rgba(255,92,114,0.4)',
      }))
      volumeSeriesRef.current.setData(volData)
    }

    chartRef.current.timeScale().fitContent()
  }, [data, positive])

  return <div ref={containerRef} style={{ height, width: '100%' }} />
}
