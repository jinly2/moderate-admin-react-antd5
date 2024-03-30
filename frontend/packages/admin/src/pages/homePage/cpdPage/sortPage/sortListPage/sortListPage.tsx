import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Table, message } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dp, useFlat } from "src/reduxService";
import ModalForm from "./components/modalForm/modalForm";
import SearchForm from "./components/searchForm/searchForm";
import styles from "./style.module.scss";
import useConfig from "./useConfig";

const ListPage = () => {
  const { columns } = useConfig();
  const {
    list,
    tablePagedata,
    setIsShowModal,
    setPageData,
    deleteAct,
    queryListAct,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useFlat("sortStore");
  const { t } = useTranslation(["sort"]);
  const { t: commonT } = useTranslation(["common"]);
  useEffect(() => {
    setPageData({
      pageNum: 1,
    });
  }, []);
  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  const [messageApi] = message.useMessage();
  return (
    <div className={styles.content}>
      {/* 搜索栏目 */}
      <SearchForm></SearchForm>
      {/* 按钮  */}

      <Row>
        <Col span={4} style={{ textAlign: "left" }}>
          {t`sortItem.listTile`}
        </Col>
        <Col span={20} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => {
              setIsShowModal(true);
              dp("sortStore", "setCurrentData", null);
            }}
            style={{
              marginBottom: 12,
            }}
            icon={<PlusOutlined />}
          >
            {t`sortItem.add`}
          </Button>
          <Button
            onClick={() => {
              Modal.confirm({
                title: t`sortItem.DelTile`,
                content: t`sortItem.modalDeleteContent`,
                onOk: async () => {
                  if (selectedRowKeys.length > 0) {
                    await deleteAct({
                      id: selectedRowKeys,
                    });
                    queryListAct();
                  } else {
                    return messageApi.open({
                      type: "warning",
                      content: commonT`blog.warn_select`,
                    });
                  }
                },
                okText: t`sortItem.Yes`,
                cancelText: t`sortItem.No`,
              });
            }}
            style={{
              marginBottom: 12,
              marginLeft: 12,
            }}
          >
            {t`sortItem.delete`}
          </Button>
        </Col>
      </Row>

      {/* modal */}
      <ModalForm />
      {/* 表格 */}
      <Table
        rowKey={(record) => {
          return record.id;
        }}
        // rowSelection={rowSelection}
        pagination={{
          showSizeChanger: true,
          pageSize: tablePagedata.pageSize,
          current: tablePagedata.pageNum,
          total: tablePagedata.total,
          onChange(page, pageSize) {
            // pageSize改变了
            if (tablePagedata.pageSize !== pageSize) {
              setPageData({
                pageNum: 1,
                pageSize: pageSize,
              });
            } else {
              setPageData({
                pageNum: page,
              });
            }
          },
        }}
        columns={columns}
        dataSource={list}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </div>
  );
};

export default ListPage;