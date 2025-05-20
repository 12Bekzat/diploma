import { useMainStore } from "@/stores/mainStore";
import { useApiFetch } from "@/utils/apiFetch";
import { storeToRefs } from "pinia";

export const useQueries = () => {
  const mainStore = useMainStore();
  const { currentUser } = storeToRefs(mainStore);

  const requests = [
    {
      id: 1,
      userId: 1, // ID сотрудника
      userName: "User User", // Имя сотрудника
      type: "Отпуск", // Тип запроса (отпуск, повышение и т. д.)
      status: "pending", // Статус: pending (в ожидании), approved (одобрено), rejected (отклонено)
      createdAt: "2024-03-20T10:15:00Z", // Дата создания
      updatedAt: "2024-03-22T14:30:00Z", // Дата последнего изменения
      description: "Запрашиваю отпуск с 1 по 14 апреля.", // Описание запроса
      adminComment: null, // Комментарий администратора (если отклонён или рассмотрен)
      preview: "@assets/request_1.png",
    },
    {
      id: 2,
      userId: 1,
      userName: "User User",
      type: "Повышение зарплаты",
      status: "approved",
      createdAt: "2024-03-10T08:45:00Z",
      updatedAt: "2024-03-15T12:00:00Z",
      description: "Прошу рассмотреть возможность повышения зарплаты на 10%.",
      adminComment: "Зарплата будет повышена с 1 мая.",
      preview: "@assets/request_2.png",
    },
    {
      id: 3,
      userId: 1,
      userName: "User User",
      type: "Другое",
      status: "rejected",
      createdAt: "2024-02-28T09:30:00Z",
      updatedAt: "2024-03-02T16:45:00Z",
      description: "Прошу изменить график работы.",
      adminComment: "К сожалению, изменение графика невозможно.",
      preview: "@assets/request_3.png",
    },
  ];

  const getPaged = async ({ serviceName }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest(`/${serviceName}/getPaged`)
  };

  const getGeneratedPDF = async ({ id }) => {
    const { makeFileRequest } = useApiFetch()

    return await makeFileRequest(`/documents/${id}/generate`)
  };
  
  const getMyRequests = async ({ id }) => {
    const { getRequest } = useApiFetch()

    return await getRequest(`/documents/getPaged/${id}`)
  };

  const getRequests = async () => {
    const { makeRequest } = useApiFetch()

    return await makeRequest(`/documents/getAll`)
  };

  const getById = async ({ id, serviceName }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest(`/${serviceName}/getById`, id)
  };

  const update = async ({ item, serviceName }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest(`/${serviceName}/update`, item)
  }
  
  const create = async ({ item, serviceName }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest(`/${serviceName}/create`, item)
  }
  
  const remove = async ({ id, serviceName }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest(`/${serviceName}/remove`, id)
  }

  const sendRequest = async ({ requesterId, templateId }, extra = '') => {
    const { makeRequest } = useApiFetch()

    const item  = {
      requesterId, templateId
    }

    if(extra) item.extra = extra

    return await makeRequest(`/documents/request`, item)
  }

  const getMessages = async ({ receiverId, senderId }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest('/messages/getPaged', { senderId, receiverId })
  }

  const sendMessage = async ({ receiverId, senderId, text }) => {
    const { makeRequest } = useApiFetch()

    return await makeRequest('/messages/send', { receiverId, senderId, text })
  }

  const approveDocument = async ({ id, approverId }) => {
    const { makeRequest } = useApiFetch()

    await makeRequest(`/documents/${id}/approve?approverId=${approverId}`)
  }

  const rejectDocument = async ({ id, reason }) => {
    const { makeRequest } = useApiFetch()

    await makeRequest(`/documents/${id}/reject?reason=${reason}`)
  }

  return {
    getPaged,
    getById,
    update,
    create,
    remove,
    sendRequest,
    getMyRequests,
    getGeneratedPDF,
    getMessages,
    sendMessage,
    getRequests,
    approveDocument,
    rejectDocument
  };
};
