import { useMainStore } from "@/stores/mainStore";
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

  const getPaged = ({ filter, orders }, { serviceName }) => {
    const items = requests.filter(
      (item) => item.userId == currentUser.value.id
    );
    console.log("items", items, currentUser.value.id);

    const response = {
      result: items,
      error: items.length ? false : true,
      message: items.length ? "" : "User not found",
      code: items.length ? 200 : 400,
    };
    return response;
  };

  const create = ({ item }, { serviceName }) => {
    const response = {
      result: null,
      error: true,
      message: "Server is available",
      code: 500,
    };
    return response;
  };

  const update = ({ item }, { serviceName }) => {
    const response = {
      result: null,
      error: true,
      message: "Server is available",
      code: 500,
    };
    return response;
  };

  const remove = ({ item }, { serviceName }) => {
    const response = {
      result: null,
      error: true,
      message: "Server is available",
      code: 500,
    };
    return response;
  };

  const createFile = ({ item }, { serviceName }) => {
    const response = {
      result: null,
      error: true,
      message: "Server is available",
      code: 500,
    };
    return response;
  };

  return {
    getPaged,
    create,
    update,
    remove,
    createFile
  };
};
