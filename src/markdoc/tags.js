import { Callout } from '@/components/Callout'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'
import { UseCases, UseCase } from '@/components/UseCases'

import Image from 'next/image'
import imgUsecase from '@/images/usecases/minimal.png'

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  'quick-links': {
    render: QuickLinks,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
  'UseCases': {
    render: UseCases,
  },
  'UseCase': {
    selfClosing: true,
    render: UseCase,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
  'examplePrivescMinimal': {
    selfClosing: true,
    render: () => (
      <div className="relative rounded-md w-full">
        <Image src={imgUsecase} alt="" className='rounded-md w-full' unoptimized/>
      </div>
    )
  }
}

export default tags
