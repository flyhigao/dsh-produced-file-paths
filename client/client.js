/*
 * dsh-produced-file-paths browser half.
 *
 * This is an independent replacement of the turn-tail chain entry only: it
 * renders DSH's own ProducedFiles row and adds an absolute-path copy block.
 * It does not modify dsh-sticky-notes or any shipped DSH source.
 */
window.__ModuleLoader__.load({
  id: 'dsh-produced-file-paths',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    var React = require('react');
    var primitives = require('@deepseek-ai/dsh-client-ui-primitives');
    var runtime = require('@deepseek-ai/dsh-client-runtime/client');
    var deliverables = require('@deepseek-ai/dsh-client-ui-deliverables/client');

    var IconCopyOutline16 = primitives.IconCopyOutline16;
    var IconCheckOutline16 = primitives.IconCheckOutline16;
    var writeClipboard = primitives.writeClipboard;
    var resolveWorkspacePath = runtime.resolveWorkspacePath;
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
        '[data-dsh-produced-file-paths]{display:flex;flex-direction:column;gap:4px;margin-top:-8px;color:var(--dsw-alias-label-secondary,#61666b);font-size:12px;line-height:18px}',
        '[data-dsh-produced-file-paths] [data-path-header]{display:flex;align-items:center;justify-content:space-between;gap:8px}',
        '[data-dsh-produced-file-paths] [data-path-title]{color:var(--dsw-alias-label-tertiary,#81858c)}',
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
      filePaths: '文件路径',
      copyPath: '复制路径',
      copyPaths: '复制全部路径',
      copied: '已复制',
    };

    var en = {
      filePaths: 'File paths',
      copyPath: 'Copy path',
      copyPaths: 'Copy all paths',
      copied: 'Copied',
    };

    function selectProducedPaths(owner) {
      var data = owner && owner.turn && owner.turn.data
        ? owner.turn.data.get('deliverables')
        : undefined;
      var paths = deliverables.producedForClosing(data, owner ? owner.seq : Number.POSITIVE_INFINITY);
      return paths.length === 0 ? null : paths;
    }

    function PathList(props) {
      var paths = props.matched || [];
      var sessionId = props.sessionId;
      var cwd = props.useSessions(function (snapshot) {
        var session = snapshot && snapshot.byId ? snapshot.byId[sessionId] : undefined;
        return session ? session.cwd : undefined;
      });
      var resolvedPaths = useMemo(function () {
        return paths.map(function (path) { return resolveWorkspacePath(cwd, path); });
      }, [paths, cwd]);
      var _a = useState(null);
      var copied = _a[0];
      var setCopied = _a[1];
      var copyTimer = useRef(null);
      var t = props.t;

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
        writeClipboard(text).then(function (ok) {
          if (ok) markCopied(key);
        });
      }

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
            ? React.createElement(IconCheckOutline16, { size: 14 })
            : React.createElement(IconCopyOutline16, { size: 14 }),
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
              ? React.createElement(IconCheckOutline16, { size: 14 })
              : React.createElement(IconCopyOutline16, { size: 14 }))
          );
        }))
      );
    }

    function ProducedPathsSlot(props) {
      return React.createElement(React.Fragment, null,
        React.createElement(deliverables.ProducedFiles, {
          matched: props.matched,
          openFile: props.openFile,
          isLoopback: props.isLoopback,
          useHostDescription: props.useHostDescription,
          t: props.deliverablesT,
        }),
        React.createElement(PathList, props)
      );
    }

    function apply(ctx) {
      var connection = ctx.get('connection');
      ctx.effect(function () {
        return ctx.locale.register(NS, { zh: zh, en: en });
      }, 'dsh-produced-file-paths: dictionaries');

      ctx.slots.inject('conversation.chat.turnTail', function () {
        return ctx.slots.register({
          name: 'conversation.chat.turnTail',
          id: 'dsh-produced-file-paths',
          priority: -100,
          order: 0,
          locale: NS,
          select: selectProducedPaths,
          inject: function () {
            return {
              isLoopback: connection.isLoopback,
              hooks: { hostDescription: connection.hostDescription },
              deliverablesT: ctx.locale.bind('deliverables'),
            };
          },
        }, ProducedPathsSlot);
      });
    }

    exports.inject = ['slots', 'locale', 'connection'];
    exports.apply = apply;
    return module.exports;
  },
});
