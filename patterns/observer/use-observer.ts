"use client"

import { useState, useEffect } from "react"
import type { Subject, Observer } from "./subject"

export function useObserver<T>(subject: Subject<T>): T {
  const [state, setState] = useState<T>(subject.getState())

  useEffect(() => {
    const observer: Observer<T> = {
      update(data: T) {
        setState(data)
      },
    }

    subject.attach(observer)

    return () => {
      subject.detach(observer)
    }
  }, [subject])

  return state
}
