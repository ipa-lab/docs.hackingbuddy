import Image, { StaticImageData } from 'next/image'

import imgMinimal from '@/images/usecases/minimal.png'
import imgLinux from '@/images/usecases/linux_privesc.png'
import imgWeb from '@/images/usecases/web_pentest.png'
import imgApiTesting from '@/images/usecases/web_api_testing.png'
import imgApiDocumentation from '@/images/usecases/web_api_documentation.png'
import imgApiDocumentationUML from '@/images/usecases/Webdoc_class_diagram.png'
import imgApiTestingUML from '@/images/usecases/Webtest_class_diagram.png'
import imgExtendPrivesc1 from '@/images/usecases/extended_privesc_usecase_1.png'
import imgExtendPrivesc2 from '@/images/usecases/extended_privesc_usecase_2.png'

export function UseCases({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      {children}
    </div>
  )
}

const images: { [key: string]: StaticImageData } = {
  minimal: imgMinimal,
  linux: imgLinux,
  web: imgWeb,
  api: imgApiTesting,
  api_doc_uml: imgApiDocumentationUML,
  api_test_uml: imgApiTestingUML,
  api_doc: imgApiDocumentation,
  extended_privesc_1: imgExtendPrivesc1,
  extended_privesc_2: imgExtendPrivesc2
};

export function UseCaseImage({ icon }: { icon: string }) {
  return (
    <Image src={images[icon]} alt={icon} className="rounded-lg"/>
  )
}

export function UseCase({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <div className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-60 sm:pt-36 lg:pt-60">
      <Image src={images[icon]} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover mt-0 mb-0"/>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
      <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>

      <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
        <a href={href} className="text-white no-underline hover:underline">
          <span className="absolute inset-0"></span>
          {title}
        </a>
      </h3>
      <span className="text-white">{description}</span>
    </div>
  )
}
