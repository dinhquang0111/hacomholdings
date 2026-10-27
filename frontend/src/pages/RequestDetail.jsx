import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, downloadFile } from "../api";
import { useAuth } from "../auth";
import StatusBadge from "../components/StatusBadge";
import { formatDate, PRIORITY_LABEL } from "../format";

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [content, setContent] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [comment, setComment] = useState("");

  async function load() {
    setError("");
    const [r, e, c, a] = await Promise.all([
      api.getRequest(id),
      api.events(id),
      api.comments(id),
      api.attachments(id),
    ]);
    setRequest(r.request);
    setEvents(e.items);
    setComments(c.items);
    setAttachments(a.items);
    if (user.role === "COORDINATOR" && user.serviceDepartmentId) {
      const list = await api.agents(user.serviceDepartmentId);
      setAgents(list.items);
      setAssigneeId(list.items[0]?.id || "");
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isCreator = request && request.createdBy === user.id;
  const isAssignee = request && request.assignedTo === user.id && user.role === "AGENT" && !isCreator;
  const isCoordinator =
    user.role === "COORDINATOR" &&
    request &&
    user.serviceDepartmentId === request.handlingDepartmentId &&
    !isCreator;

  const actions = useMemo(() => {
    if (!request) return [];
    const list = [];
    if (isCoordinator && request.status === "SUBMITTED") {
      list.push({ key: "assign", label: "Phân công", needAssignee: true, needContent: false });
      list.push({ key: "reject", label: "Từ chối tiếp nhận", needContent: true });
      list.push({ key: "cancel", label: "Hủy", needContent: true });
    }
    if (isCoordinator && ["ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER", "RESOLVED"].includes(request.status)) {
      list.push({ key: "reassign", label: "Giao lại", needAssignee: true, needContent: true });
    }
    if (isCoordinator && ["ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER"].includes(request.status)) {
      list.push({ key: "cancel", label: "Hủy (điều phối)", needContent: true });
    }
    if (isAssignee && request.status === "ASSIGNED") {
      list.push({ key: "start", label: "Bắt đầu xử lý" });
    }
    if (isAssignee && request.status === "IN_PROGRESS") {
      list.push({ key: "request-info", label: "Hỏi bổ sung", needContent: true });
      list.push({ key: "resolve", label: "Báo kết quả", needContent: true });
    }
    if (isCreator && request.status === "WAITING_FOR_REQUESTER") {
      list.push({ key: "provide-info", label: "Gửi bổ sung", needContent: true });
    }
    if (isCreator && request.status === "RESOLVED") {
      list.push({ key: "confirm", label: "Xác nhận đạt" });
      list.push({ key: "reopen", label: "Phản hồi chưa đạt", needContent: true });
    }
    if (isCreator && request.status === "SUBMITTED") {
      list.push({ key: "cancel", label: "Hủy yêu cầu", needContent: true });
    }
    return list;
  }, [request, isCreator, isAssignee, isCoordinator]);

  async function runAction(action) {
    setError("");
    setInfo("");
    try {
      const body = { expected_version: request.version };
      if (action.needContent) body.content = content;
      if (action.needAssignee) body.assignee_id = assigneeId;
      await api.action(id, action.key, body);
      setContent("");
      setInfo("Thao tác thành công.");
      await load();
    } catch (err) {
      if (err.status === 409) {
        setError("Xung đột dữ liệu (HTTP 409). Hồ sơ sẽ được tải lại.");
        load().catch(() => {});
      } else {
        setError(err.message);
      }
    }
  }

  async function sendComment(e) {
    e.preventDefault();
    setError("");
    try {
      await api.addComment(id, comment);
      setComment("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setInfo("");
    try {
      await api.upload(id, file);
      setInfo(`Đã tải lên ${file.name}`);
      await load();
    } catch (err) {
      setError(`Gửi hồ sơ thành công trước đó nhưng tệp chưa tải lên được: ${err.message}`);
    }
  }

  if (!request && !error) return <p>Đang tải...</p>;
  if (!request) return <p className="text-rose-700">{error}</p>;

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">{request.requestCode}</div>
            <h1 className="text-2xl font-semibold">{request.title}</h1>
          </div>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-4 whitespace-pre-wrap text-slate-700">{request.description}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-slate-500">Loại</dt>
            <dd>{request.requestTypeName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Người gửi</dt>
            <dd>{request.createdByName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Người xử lý</dt>
            <dd>{request.assignedToName || "Chưa phân công"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ưu tiên</dt>
            <dd>{PRIORITY_LABEL[request.priority]}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Gửi lúc</dt>
            <dd>{formatDate(request.submittedAt)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Hạn xử lý</dt>
            <dd>
              {formatDate(request.dueAt)} {request.overdue ? <span className="text-rose-700">(Quá hạn)</span> : null}
            </dd>
          </div>
        </dl>
        {request.waitingQuestion && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Câu hỏi đang chờ:</strong> {request.waitingQuestion}
          </div>
        )}
        {request.currentResolution && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
            <strong>Kết quả hiện tại:</strong> {request.currentResolution}
          </div>
        )}
      </section>

      {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {info && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{info}</p>}

      {actions.length > 0 && (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Hành động</h2>
          {(actions.some((a) => a.needContent) || actions.some((a) => a.needAssignee)) && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {actions.some((a) => a.needAssignee) && (
                <label className="text-sm">
                  Chọn agent
                  <select
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    {agents
                      .filter((a) => a.id !== request.createdBy)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.displayName}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {actions.some((a) => a.needContent) && (
                <label className="text-sm md:col-span-2">
                  Nội dung hành động
                  <textarea
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Câu hỏi, kết quả, lý do..."
                  />
                </label>
              )}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.key + action.label}
                onClick={() => runAction(action)}
                className="rounded-lg bg-teal-700 px-3 py-2 text-sm text-white hover:bg-teal-800"
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Lịch sử</h2>
          <ol className="mt-3 space-y-3">
            {events.map((ev) => (
              <li key={ev.id} className="border-l-2 border-teal-600 pl-3 text-sm">
                <div className="font-medium">
                  {ev.eventType} {ev.fromStatus ? `${ev.fromStatus} → ${ev.toStatus}` : `→ ${ev.toStatus}`}
                </div>
                <div className="text-slate-500">
                  {ev.actorName} · {formatDate(ev.createdAt)} · v{ev.requestVersion}
                </div>
                {ev.reasonOrContent && <div className="mt-1 text-slate-700">{ev.reasonOrContent}</div>}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Bình luận</h2>
          <div className="mt-3 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">
                  {c.authorName} · {formatDate(c.createdAt)}
                </div>
                <div className="mt-1 whitespace-pre-wrap">{c.content}</div>
              </div>
            ))}
            {!comments.length && <p className="text-sm text-slate-500">Chưa có bình luận.</p>}
          </div>
          <form onSubmit={sendComment} className="mt-4">
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bình luận thường không đổi trạng thái"
            />
            <button className="mt-2 rounded-lg border px-3 py-2 text-sm">Gửi bình luận</button>
          </form>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Tệp đính kèm</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {attachments.map((f) => (
            <li key={f.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>
                {f.originalName} ({Math.round(f.sizeBytes / 1024)} KB)
              </span>
              <button className="text-teal-800 underline" onClick={() => downloadFile(f.id, f.originalName)}>
                Tải xuống
              </button>
            </li>
          ))}
          {!attachments.length && <li className="text-slate-500">Chưa có tệp.</li>}
        </ul>
        <label className="mt-4 block text-sm">
          Tải tệp PNG/JPEG/PDF, tối đa 5 MiB, tối đa 5 tệp/hồ sơ
          <input type="file" className="mt-1 block" onChange={upload} />
        </label>
      </section>
    </div>
  );
}
