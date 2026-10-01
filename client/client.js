/*
 * dsh-produced-file-paths browser half.
 *
 * Renders an absolute-path copy block for files produced in the turn.
 */
window.__ModuleLoader__.load({
  id: 'dsh-produced-file-paths',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    var React = require('react');
    var primitives = require('@deepseek-ai/dsh-client-ui-primitives');

    var writeClipboard = primitives.writeClipboard;

    function IconCopy(props) {
      var size = (props && props.size) || 14;
      return React.createElement('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        style: { display: 'block' },
      },
        React.createElement('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 }),
        React.createElement('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
      );
    }

    function IconCheck(props) {
      var size = (props && props.size) || 14;
      return React.createElement('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        style: { display: 'block' },
      },
        React.createElement('polyline', { points: '20 6 9 17 4 12' })
      );
    }

    function isWindowsStylePath(value) {
      return /^[A-Za-z]:[/\\\\]/.test(value) || value.startsWith('\\\\');
    }

    function resolveWorkspacePath(cwd, path) {
      if (!path) return '';
      if (path.startsWith('/') || isWindowsStylePath(path)) return path;
      if (!cwd) return path;
      var base = cwd.replace(/[/\\\\]+$/, '');
      var rel = path.replace(/^[/\\\\]+/, '');
      return base + '/' + rel;
    }

    var useState = React.useState;
    var useMemo = React.useMemo;
    var useEffect = React.useEffect;
    var useRef = React.useRef;

    var NS = 'dsh-produced-file-paths';
    var styleId = 'dsh-produced-file-paths';

    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css="' + styleId + '"]') === null) {
      var style = document.createElement('style');
      style.setAttribute('data-plugin', styleId);
      style.setAttribute('data-plugin-css', styleId);
      style.textContent = [
        '[data-dsh-produced-file-paths]{display:flex;flex-direction:column;gap:4px;margin-top:4px;margin-bottom:8px;color:var(--dsw-alias-label-secondary,#61666b);font-size:12px;line-height:18px}',
        '[data-dsh-produced-file-paths] [data-path-header]{display:flex;align-items:center;justify-content:space-between;gap:8px}',
        '[data-dsh-produced-file-paths] [data-path-title]{color:var(--dsw-alias-label-tertiary,#81858c);font-weight:500}',
        '[data-dsh-produced-file-paths] [data-path-list]{display:flex;flex-direction:column;gap:2px;max-height:180px;overflow-y:auto;padding:4px 8px;border-radius:6px;background:var(--dsw-alias-interactive-bg-hover,#f5f6f7)}',
        '[data-dsh-produced-file-paths] [data-path-row]{display:flex;align-items:center;gap:8px;min-width:0;padding:3px 0}',
        '[data-dsh-produced-file-paths] code{min-width:0;flex:1;overflow-wrap:anywhere;user-select:text;color:var(--dsw-alias-label-secondary,#61666b);font:var(--dsw-font-markdown-code-inline,12px/18px ui-monospace,monospace)}',
        '[data-dsh-produced-file-paths] button{display:inline-flex;align-items:center;justify-content:center;gap:4px;flex-shrink:0;height:26px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;font:inherit;font-size:12px;line-height:20px}',
        '[data-dsh-produced-file-paths] button:hover{background:var(--dsw-alias-interactive-bg-hover-solid,var(--dsw-alias-interactive-bg-hover,#f5f6f7));color:var(--dsw-alias-label-primary,#1f2328)}',
        '[data-dsh-produced-file-paths] [data-path-copy-one]{padding:0 6px}',
      ].join('');
      document.head.appendChild(style);
    }

    var zh = {
      filePaths: '产出文件绝对路径',
      copyPath: '复制路径',
      copyPaths: '复制全部路径',
      copied: '已复制',
    };

    var en = {
      filePaths: 'Produced File Paths',
      copyPath: 'Copy path',
      copyPaths: 'Copy all paths',
      copied: 'Copied',
    };

    function selectProducedPaths(owner) {
      if (!owner) return null;
      var turn = owner.turn;
      var data = turn && turn.data && typeof turn.data.get === 'function'
        ? turn.data.get('deliverables')
        : undefined;
      if (!data) return null;
      var seq = typeof owner.seq === 'number' ? owner.seq : Number.POSITIVE_INFINITY;
      var paths = [];
      var seen = new Set();
      if (Array.isArray(data.produced)) {
        for (var i = 0; i < data.produced.length; i++) {
          var item = data.produced[i];
          if (item && item.path && item.seq <= seq && !seen.has(item.path)) {
            seen.add(item.path);
            paths.push(item.path);
          }
        }
      }
      if (Array.isArray(data.presented)) {
        for (var j = 0; j < data.presented.length; j++) {
          var pres = data.presented[j];
          if (pres && pres.path && pres.seq <= seq && !seen.has(pres.path)) {
            seen.add(pres.path);
            paths.push(pres.path);
          }
        }
      }
      return paths.length === 0 ? null : paths;
    }

    function PathList(props) {
      var paths = (props && props.matched) || selectProducedPaths(props) || [];
      var sessionId = props && props.sessionId;
      var sessions = typeof (props && props.useSessions) === 'function'
        ? props.useSessions(function (snapshot) { return snapshot; })
        : undefined;
      var workspaces = typeof (props && props.useWorkspaces) === 'function'
        ? props.useWorkspaces(function (snapshot) { return snapshot; })
        : undefined;

      var cwd = useMemo(function () {
        if (sessions && sessionId) {
          if (sessions.byId && sessions.byId[sessionId] && sessions.byId[sessionId].cwd) {
            return sessions.byId[sessionId].cwd;
          }
          if (Array.isArray(sessions.items)) {
            var s = sessions.items.find(function (item) { return item.sessionId === sessionId || item.id === sessionId; });
            if (s && s.cwd) return s.cwd;
          }
        }
        if (workspaces && Array.isArray(workspaces.items)) {
          if (sessionId) {
            var ws = workspaces.items.find(function (w) {
              return Array.isArray(w.sessionIds) && w.sessionIds.includes(sessionId);
            });
            if (ws && ws.path) return ws.path;
          }
          if (workspaces.items[0] && workspaces.items[0].path) {
            return workspaces.items[0].path;
          }
        }
        return '';
      }, [workspaces, sessions, sessionId]);

      var resolvedPaths = useMemo(function () {
        return paths.map(function (path) { return resolveWorkspacePath(cwd, path); });
      }, [paths, cwd]);

      var _a = useState(null);
      var copied = _a[0];
      var setCopied = _a[1];
      var copyTimer = useRef(null);
      var t = props.t || (function (key) { return zh[key] || en[key] || key; });

      useEffect(function () {
        return function () {
          if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
        };
      }, []);

      function markCopied(key) {
        setCopied(key);
        if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(function () {
          copyTimer.current = null;
          setCopied(null);
        }, 1200);
      }

      function copy(text, key) {
        if (typeof writeClipboard === 'function') {
          writeClipboard(text).then(function (ok) {
            if (ok) markCopied(key);
          }).catch(function () {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(text).then(function () { markCopied(key); });
            }
          });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () { markCopied(key); });
        }
      }

      if (resolvedPaths.length === 0) return null;

      var allText = resolvedPaths.join('\n');
      return React.createElement('div', { 'data-dsh-produced-file-paths': true },
        React.createElement('div', { 'data-path-header': true },
          React.createElement('span', { 'data-path-title': true }, t('filePaths') + ' (' + resolvedPaths.length + ')'),
          React.createElement('button', {
            type: 'button',
            title: copied === 'all' ? t('copied') : t('copyPaths'),
            'aria-label': copied === 'all' ? t('copied') : t('copyPaths'),
            onClick: function () { copy(allText, 'all'); },
          }, copied === 'all'
            ? React.createElement(IconCheck, { size: 14 })
            : React.createElement(IconCopy, { size: 14 }),
          copied === 'all' ? t('copied') : t('copyPaths'))
        ),
        React.createElement('div', { 'data-path-list': true }, resolvedPaths.map(function (path, index) {
          var key = 'path-' + index;
          var isCopied = copied === key;
          return React.createElement('div', { key: key, 'data-path-row': true },
            React.createElement('code', { title: path }, path),
            React.createElement('button', {
              type: 'button',
              'data-path-copy-one': true,
              title: isCopied ? t('copied') : t('copyPath'),
              'aria-label': isCopied ? t('copied') : t('copyPath'),
              onClick: function () { copy(path, key); },
            }, isCopied
              ? React.createElement(IconCheck, { size: 14 })
              : React.createElement(IconCopy, { size: 14 }))
          );
        }))
      );
    }

    function apply(ctx) {
      ctx.effect(function () {
        return ctx.locale.register(NS, { zh: zh, en: en });
      }, 'dsh-produced-file-paths: dictionaries');

      ctx.slots.inject('conversation.chat.turnTail', function () {
        return ctx.slots.register({
          name: 'conversation.chat.turnTail',
          id: 'dsh-produced-file-paths',
          order: 10,
          locale: NS,
          select: selectProducedPaths,
          inject: function () {
            return {
              t: ctx.locale.bind(NS),
            };
          },
        }, PathList);
      });
    }

    exports.name = 'dsh-produced-file-paths';
    exports.inject = ['slots', 'locale'];
    exports.apply = apply;
    return module.exports;
  },
});
