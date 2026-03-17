import { DocumentData, FieldValue, QueryDocumentSnapshot } from "firebase/firestore"

export type HeistStatus = "success" | "failure"

export interface Heist {
  id: string
  title: string
  description: string
  createdBy: string
  createdByCodeName: string
  assignedTo: string
  assignedToCodeName: string
  createdAt: Date
  deadline: Date
  finalStatus: HeistStatus | null
}

export interface CreateHeistInput {
  title: string
  description: string
  createdBy: string
  createdByCodeName: string
  assignedTo: string
  assignedToCodeName: string
  createdAt: FieldValue
  deadline: Date
  finalStatus: null
}

export interface UpdateHeistInput {
  title?: string
  description?: string
  assignedTo?: string
  assignedToCodeName?: string
  deadline?: Date
  finalStatus?: HeistStatus | null
}

export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      deadline: snapshot.data().deadline?.toDate(),
    }) as Heist,
}
