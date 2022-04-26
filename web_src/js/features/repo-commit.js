const {csrfToken} = window.config;

export function initRepoEllipsisButton() {
  $('.ellipsis-button').on('click', function (e) {
    e.preventDefault();
    const expanded = $(this).attr('aria-expanded') === 'true';
    $(this).parent().find('.commit-body').toggle();
    $(this).attr('aria-expanded', String(!expanded));
  });
}

export function initRepoCommitLastCommitLoader() {
  const entryMap = {};

  const entries = $('table#repo-files-table tr.notready')
    .map((_, v) => {
      entryMap[$(v).attr('data-entryname')] = $(v);
      return $(v).attr('data-entryname');
    })
    .get();

  if (entries.length === 0) {
    return;
  }

  const lastCommitLoaderURL = $('table#repo-files-table').data('lastCommitLoaderUrl');

  if (entries.length > 200) {
    $.post(lastCommitLoaderURL, {
      _csrf: csrfToken,
    }, (data) => {
      $('table#repo-files-table').replaceWith(data);
    });
    return;
  }

  $.post(lastCommitLoaderURL, {
    _csrf: csrfToken,
    'f': entries,
  }, (data) => {
    $(data).find('tr').each((_, row) => {
      if (row.className === 'commit-list') {
        $('table#repo-files-table .commit-list').replaceWith(row);
        return;
      }
      entryMap[$(row).attr('data-entryname')].replaceWith(row);
    });
  });
}

export function initCommitStatuses() {
  $('.commit-statuses-trigger').each(function () {
    const positionRight = $('.repository.file.list').length > 0 || $('.repository.diff').length > 0;
    const popupPosition = positionRight ? 'right center' : 'left center';
    $(this)
      .popup({
        on: 'click',
        lastResort: popupPosition, // prevent error message "Popup does not fit within the boundaries of the viewport"
        position: popupPosition,
      });
  });
}
