export default (page?: any) =>
    page
        ? {
              current: page.currentPage,
              total: page.totalCount,
              pageSize: page.limit,
          }
        : { current: 1, total: 0, pageSize: 25 };
